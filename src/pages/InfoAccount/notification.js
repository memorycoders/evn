import React, { useEffect, useState } from 'react';
import moment from 'moment';
import { connect } from "react-redux";
import "./notification.scss";
import  http from "../../apis/http"

function Notification(props) {

    const [notification,setNotification] = useState([])

    // console.log("match",props.match.params.id);
    
    useEffect(()=>{
        
    },[])
    return(
        <div>
            Bạn chưa có thông báo nào!
        </div>
    )
}
const mapDispatchToProps = (dispatch) => ({
	
});

export default connect((state) => (null), mapDispatchToProps)(Notification);