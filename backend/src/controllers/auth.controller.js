const login = async (req, res) => {
    res.send('Login endpoint');
}

const signup = async (req, res) => {
    res.send('Signup endpoint');
}

const logout =  async (req, res) => {
    res.send('Logout endpoint');
}

export { login, signup, logout };