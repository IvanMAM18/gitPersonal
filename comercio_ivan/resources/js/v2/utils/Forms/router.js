import AxiosInstance from 'axios';
import { hasFiles } from './files';
import { objectToFormData } from './formData';
import { hrefToUrl, mergeDataIntoQueryString, urlWithoutHash } from './url';

export class Router {

    visit(href, {
        method = 'get',
        data = {},
        forceFormData = false,
        onStart = () => { },
        onProgress = () => { },
        onCancel = () => {},
        onSuccess = () => { },
        onError = () => { },
        queryStringArrayFormat = 'brackets',
    } = {}) {
        let url = typeof href === 'string' ? hrefToUrl(href) : href;

        if ((hasFiles(data) || forceFormData) && !(data instanceof FormData)) {
            data = objectToFormData(data);
        }

        if (!(data instanceof FormData)) {
            const [_href, _data] = mergeDataIntoQueryString(method, url, data, queryStringArrayFormat);
            url = hrefToUrl(_href);
            data = _data;
        }

        onStart()

        AxiosInstance({
            method,
            url: urlWithoutHash(url).href,
            data: method === 'get' ? {} : data,
            params: method === 'get' ? data : {},
            onUploadProgress: progress => {
                if (data instanceof FormData) {
                    progress.percentage = progress.progress ? Math.round(progress.progress * 100) : 0;
                    onProgress(progress);
                }
            },
        })
            .then(response => {
                onSuccess(response.data)
            })
            .catch(error => {
                let errorBag = {}
                if (error.response.data.errors) {
                    Object.keys(error.response.data.errors).forEach(key => errorBag[key] = error.response.data.errors[key][0]);
                }
                onError(errorBag, error.response.data.message)
            })
    }


    get(url, data = {}, options = {}) {
        return this.visit(url, { ...options, method: 'get', data });
    }

    post(url, data = {}, options = {}) {
        return this.visit(url, { ...options, method: 'post', data });
    }

    put(url, data = {}, options = {}) {
        return this.visit(url, {...options, method: 'put', data });
    }

    patch(url, data = {}, options = {}) {
        return this.visit(url, { ...options, method: 'patch', data });
    }

    delete(url, options = {}) {
        return this.visit(url, { ...options, method: 'delete' });
    }
}
