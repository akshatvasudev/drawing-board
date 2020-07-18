import axios from 'axios';
import constants from '../helpers/constants'

const loginState = async (props) => {
    let _resp = await axios.get(`${constants.server}/auth`, { withCredentials: true });
    if (!_resp.data) {
        props.history && props.history.push('/auth')
        return false
    } else {
        return _resp.data.username;
    }
}

const logout = async (props) => {
    await axios.delete(`${constants.server}/auth`, { withCredentials: true });
    props.history && props.history.push('/auth')
}

export { loginState, logout };