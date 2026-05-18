interface SpeechRecognitionInstance extends EventTarget {
  lang: string
  continuous: boolean
  interimResults: boolean
  start(): void
  stop(): void
  onresult: ((event: SpeechRecognitionEvent) => void) | null
  onerror: ((event: SpeechRecognitionErrorEvent) => void) | null
  onend: (() => void) | null
}

interface SpeechRecognitionEvent {
  resultIndex: number
  results: SpeechRecognitionResultList
}

interface SpeechRecognitionErrorEvent {
  error: string
}

declare global {
  interface Window {
    SpeechRecognition?: new () => SpeechRecognitionInstance
    webkitSpeechRecognition?: new () => SpeechRecognitionInstance
  }
}

export interface UseSpeechRecognitionOptions {
  lang?: string
  onTranscript?: (text: string, isFinal: boolean) => void
  onRecordingStart?: () => void
  onRecordingCancel?: () => void
}

export function useSpeechRecognition(options: UseSpeechRecognitionOptions = {}) {
  const lang = options.lang ?? 'ru-RU'

  const isSupported = ref(false)
  const isListening = ref(false)
  const error = ref<string | null>(null)

  let recognition: SpeechRecognitionInstance | null = null
  let activeSession = false
  let cancelled = false
  let finalizedTranscript = ''

  function getRecognitionCtor() {
    if (import.meta.server) {
      return null
    }
    return window.SpeechRecognition ?? window.webkitSpeechRecognition ?? null
  }

  function mapSpeechError(code: string): string {
    switch (code) {
      case 'not-allowed':
        return 'Доступ к микрофону запрещён'
      case 'no-speech':
        return 'Речь не распознана. Попробуйте ещё раз'
      case 'network':
        return 'Ошибка сети при распознавании речи'
      default:
        return 'Не удалось распознать речь'
    }
  }

  function resetSessionState() {
    finalizedTranscript = ''
    cancelled = false
  }

  function endSession() {
    activeSession = false
    isListening.value = false
    recognition?.stop()
    finalizedTranscript = ''
  }

  function start() {
    error.value = null

    if (!isSupported.value || !recognition) {
      error.value = 'Голосовой ввод недоступен в этом браузере'
      return
    }

    if (isListening.value) {
      return
    }

    resetSessionState()
    activeSession = true

    try {
      options.onRecordingStart?.()
      recognition.start()
      isListening.value = true
    } catch {
      activeSession = false
      error.value = 'Не удалось запустить запись'
    }
  }

  function restartRecognition() {
    if (!activeSession || cancelled || !recognition) {
      return
    }

    try {
      recognition.start()
      isListening.value = true
    } catch {
      // Браузер мог ещё не отпустить сессию — onend вызовется снова
    }
  }

  function confirm() {
    if (!isListening.value && !activeSession) {
      return
    }
    endSession()
  }

  function cancel() {
    if (!isListening.value && !activeSession) {
      return
    }
    cancelled = true
    options.onRecordingCancel?.()
    endSession()
  }

  function clearError() {
    error.value = null
  }

  onMounted(() => {
    const Ctor = getRecognitionCtor()
    isSupported.value = Boolean(Ctor)

    if (!Ctor) {
      return
    }

    recognition = new Ctor()
    recognition.lang = lang
    recognition.continuous = true
    recognition.interimResults = true

    recognition.onresult = (event) => {
      if (cancelled || !activeSession) {
        return
      }

      let interim = ''

      for (let i = event.resultIndex; i < event.results.length; i++) {
        const result = event.results[i]
        if (!result) {
          continue
        }

        const text = result[0]?.transcript ?? ''

        if (result.isFinal) {
          finalizedTranscript += text
        } else {
          interim += text
        }
      }

      const full = (finalizedTranscript + interim).trim()
      if (!full) {
        return
      }

      options.onTranscript?.(full, interim.length === 0)
    }

    recognition.onerror = (event) => {
      if (event.error === 'aborted') {
        return
      }

      // Пауза в речи — не завершаем сессию, дождёмся onend и перезапуска
      if (activeSession && event.error === 'no-speech') {
        return
      }

      if (activeSession && event.error === 'network') {
        restartRecognition()
        return
      }

      error.value = mapSpeechError(event.error)
      endSession()
    }

    recognition.onend = () => {
      if (activeSession && !cancelled) {
        restartRecognition()
        return
      }

      isListening.value = false
    }
  })

  onBeforeUnmount(() => {
    endSession()
    recognition = null
  })

  return {
    isSupported,
    isListening,
    error,
    start,
    confirm,
    cancel,
    clearError
  }
}
