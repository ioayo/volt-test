export default {
	getData(query, callback) {
		return fetch(`/api/${query}`)
			.then(response => response.json())
			.then(callback)
		}
}

