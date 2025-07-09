import app from './app.js'

export default {
    start (port) {
        app.listen(port, '0.0.0.0', () => {
            console.log(`listening on ${port}`)
        })
    }
}