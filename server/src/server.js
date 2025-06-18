import app from './app.js'

export default {
    start (port) {
        app.listen(port, () => {
            console.log(port)
        })
    }
}