export function getCurrentRole() {
    const role = localStorage.getItem('role');
    return role ? role.trim().toUpperCase() : null;
}
