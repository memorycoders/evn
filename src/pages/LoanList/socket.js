import Stomp from 'stompjs';
import SockJS from 'sockjs-client';

export const connectSocket = () => {
    let stompClient = null;

    const onConnected = () => {
        console.log('connected');
        stompClient.subscribe(`/group/59f86439-8bf3-4699-bb19-65cf364d4412`, (payload) => {
            console.log('payload => ', payload)
        })

    }
    const token = sessionStorage.getItem('evn-token') && JSON.parse(sessionStorage.getItem('evn-token')).token.access_token;
    // console.log('token => ', token)
    const onError = () => {
        console.log('error' )
    }

    const socket = new SockJS(`https://evnfc.itlead.pro:8081/ws`);
    stompClient = Stomp.over(socket);
    stompClient.connect({
        'Authorization': token
    }, onConnected, onError)
}
