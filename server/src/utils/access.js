export const hasAccess = (id, data = {authorId: undefined, coAuthors: undefined}) => {
    const author = data.authorId
    const coAuthors = data.coAuthors

    if (author != null && author.toString() == id.toString()) {
        return true
    } 

    if (coAuthors != null && Array.isArray(coAuthors)) {
        return coAuthors.map(e => e.toString()).includes(id.toString())
    }

    return false
}