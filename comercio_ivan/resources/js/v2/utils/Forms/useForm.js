
import {isEqual} from 'lodash';
import { router } from '@/v2/utils/App';
import { useCallback, useEffect, useRef, useState } from 'react';

export default function useForm(initialValues) {
    const isMounted = useRef(null)
    const [defaults, setDefaults] = useState(initialValues)
    const cancelToken = useRef(null)
    const [data, setData] = useState(defaults)
    const [errors, setErrors] = useState({})
    const [hasErrors, setHasErrors] = useState(false)
    const [processing, setProcessing] = useState(false)
    const [progress, setProgress] = useState(null)
    const [wasSuccessful, setWasSuccessful] = useState(false)

    let transform = (data) => data

    useEffect(() => {
        isMounted.current = true
        return () => {
            isMounted.current = false
        }
    }, [])

    const submit = useCallback(
        (method, url, options = {}) => {
            const _options = {
                ...options,
                onCancelToken: (token) => {
                    cancelToken.current = token

                    if (options.onCancelToken) {
                        return options.onCancelToken(token)
                    }
                },
                onBefore: () => {
                    setWasSuccessful(false)

                    if (options.onBefore) {
                        return options.onBefore()
                    }
                },
                onStart: () => {
                    setProcessing(true)

                    if (options.onStart) {
                        return options.onStart()
                    }
                },
                onProgress: (event) => {
                    setProgress(event)

                    if (options.onProgress) {
                        return options.onProgress(event)
                    }
                },
                onSuccess: (page) => {
                    if (isMounted.current) {
                        setProcessing(false)
                        setProgress(null)
                        setErrors({})
                        setHasErrors(false)
                        setWasSuccessful(true)
                    }

                    if (options.onSuccess) {
                        return options.onSuccess(page)
                    }
                },
                onError: (errors, message) => {
                    if (isMounted.current) {
                        setProcessing(false)
                        setProgress(null)
                        setErrors(errors)
                        setHasErrors(true)
                    }

                    if (options.onError) {
                        window.scrollTo({top: 0, behavior: 'smooth'})
                        return options.onError(message, errors)
                    }
                },
                onCancel: () => {
                    if (isMounted.current) {
                        setProcessing(false)
                        setProgress(null)
                    }

                    if (options.onCancel) {
                        return options.onCancel()
                    }
                },
                onFinish: () => {
                    if (isMounted.current) {
                        setProcessing(false)
                        setProgress(null)
                    }

                    cancelToken.current = null

                    if (options.onFinish) {
                        return options.onFinish()
                    }
                },
            }

            if (method === 'delete') {
                router.delete(url, { ..._options, data: transform(data) })
            } else {
                router[method](url, transform(data), _options)
            }
        },
        [data, setErrors],
    )

    return {
        data,
        setData(keyOrData, maybeValue) {
            if (typeof keyOrData === 'string') {
                setData({ ...data, [keyOrData]: maybeValue })
            } else if (typeof keyOrData === 'function') {
                setData((data) => keyOrData(data))
            } else {
                setData(keyOrData)
            }
        },
        isDirty: !isEqual(data, defaults),
        errors,
        hasErrors,
        processing,
        progress,
        wasSuccessful,
        transform(callback) {
            transform = callback
        },
        setDefaults(fieldOrFields, maybeValue) {
            if (typeof fieldOrFields === 'undefined') {
                setDefaults(() => data)
            } else {
                setDefaults((defaults) => ({
                    ...defaults,
                    ...(typeof fieldOrFields === 'string' ? { [fieldOrFields]: maybeValue } : fieldOrFields),
                }))
            }
        },
        reset(...fields) {
            if (fields.length === 0) {
                setData(defaults)
            } else {
                setData(
                    (Object.keys(defaults))
                        .filter((key) => fields.includes(key))
                        .reduce(
                            (carry, key) => {
                                carry[key] = defaults[key]
                                return carry
                            },
                            { ...data },
                        ),
                )
            }
        },
        setError(fieldOrFields, maybeValue) {
            setErrors((errors) => {
                const newErrors = {
                    ...errors,
                    ...(typeof fieldOrFields === 'string'
                        ? { [fieldOrFields]: maybeValue }
                        : fieldOrFields),
                }
                setHasErrors(Object.keys(newErrors).length > 0)
                return newErrors
            })
        },
        clearErrors(...fields) {
            setErrors((errors) => {
                const newErrors = (Object.keys(errors))
                    .reduce(
                        (carry, field) => ({
                            ...carry,
                            ...(fields.length > 0 && !fields.includes(field) ? { [field]: errors[field] } : {}),
                        }),
                        {},
                    )
                setHasErrors(Object.keys(newErrors).length > 0)
                return newErrors
            })
        },
        submit,
        get(url, options) {
            submit('get', url, options)
        },
        post(url, options) {
            submit('post', url, options)
        },
        put(url, options) {
            submit('put', url, options)
        },
        patch(url, options) {
            submit('patch', url, options)
        },
        delete(url, options) {
            submit('delete', url, options)
        },
        cancel() {
            if (cancelToken.current) {
                cancelToken.current.cancel()
            }
        },
    }
}
