export default {
    conflict(res, message) {
        return res.status(409).json({ message: message })
    },
    badRequest(res, message = "Bad request", errors = []) {
        return res.status(400).json({
            message: message,
            errors: errors
        })
    },
    internalServerError(res, error) {
        console.log(error)
        return res.status(500).json({
            message: 'Internal server error',
            errors: [error]
        })
    },
    notFound(res, entityName) {
        return res.status(404).json({
            message: `${entityName} not found`
        })
    },
    deleted(res, entityName) {
        return res.status(404).json({
            message: `${entityName} deleted successfully`
        })
    },
    forbid(res) {
        return res.status(403).json('')
    }
}