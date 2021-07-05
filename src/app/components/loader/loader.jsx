import React from 'react'
import { Spin  } from 'antd';
import './loader.scss'

/**
 * @description empty data
 */

const EmptyBox = ({fetch}) => {
    
    return (
        <div className="loader">
            <Spin />
        </div>
    )
}

export default EmptyBox

