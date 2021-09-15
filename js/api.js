const api = axios.create({
    baseURL: 'http://localhost:4545',
    headers: { 'Content-Type': 'application/json;charset=utf-8' }
});

api.interceptors.response.use((response) => {
    return [response.data, null];
}, (error) => {
    return [null, error];
});

function getTodos() {
    return api.get('/todos')
}
function createTodo(newTodo) {
    return api.post('/todos', newTodo)
}
function updateTodo(id, updateData) {
    return api.patch(`/todos/${id}`, updateData)
}
function deleteTodo(id) {
    return api.delete(`/todos/${id}`)
}
