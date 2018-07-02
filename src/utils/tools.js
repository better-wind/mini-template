class Tools {
    /**
     *
     * @param obj
     * @returns {boolean}
     */
    isEmptyObject(obj) {
        var name
        for (name in obj) return false
        return true
    }

    /**
     *
     * @param value
     * @returns {boolean}
     */
    isFunction(value) {
        return typeof(value) == "function"
    }
}
export default Tools

