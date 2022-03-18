import React from 'react';
import { Spin } from 'antd';

import '../../styles/loading.scss';

const Loading = ({ type = "fullpage", style = {} }) => {

    if (type == 'inline') {
        return (
            <div className="cover-line" style={style}><Spin /></div>
        )
    }

    if (type == 'modal') {
        return (
            <div className="cover-modal" style={{ ...style, position: "absolute" }}><Spin /></div>
        )
    }

    return (
        <div className="cover-page" style={{ ...style, position: "fixed" }}>
            <Spin />
        </div>
    );
}

export default Loading;