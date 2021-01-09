module.exports = subroutine => {
    return (req, res, next) => {
        subroutine(req, res, next).catch(next)
    }
}
