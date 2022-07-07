const LOCAL_HOST = `http://127.0.0.1:5117`

const GaugeNode = {
    // Init node and deploy
    init: async () => {
        const result = await window.fetch(`${LOCAL_HOST}/init/`, {method: 'POST'}).then(response=>response.json())
        console.log('init success')
        const r = JSON.parse(result.result)
        r.host = result.host
        return r
    },
    // Call distribute method on GaugesDistributor
    distribute: async () => {
        const result = await window.fetch(`${LOCAL_HOST}/distribute/`, {method: 'POST'})
        console.log('distribute success')
        return result
    },
    time: async () => {
        const result = await window.fetch(`${LOCAL_HOST}/time/`, {method: 'POST'})
        console.log('time success')
        return result
    },
    reset: async () => {
        const result = await window.fetch(`${LOCAL_HOST}/reset/`, {method: 'POST'})
        console.log('reset success')
        return result
    },
}