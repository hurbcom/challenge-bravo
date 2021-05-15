/****************************************************************************

 COMPONENT BASEADO NO CARD DO BOOTSTRAP

*****************************************************************************/

import React from 'react';
import { Col, Row } from 'react-bootstrap';
import './hcard.scss';

function HurbCard(props){
    return(
        <Col className='card'>
            <Row className='imgTitle'>
                {props.image&&
                <>
                <img src={props.image} alt="" />
                <div className='mascara'></div>
                </>
                }
                <div className='floatTitle'>
                    <h5 className='title'>{props.title}</h5>
                    {props.subtitle &&
                    <small>{props.subtitle}</small>
                    }
                </div>
            </Row>
            <div className='warpBody'>
                <hr className='diff'/>
                {props.children}
            </div>
        </Col>
    )
}

export default HurbCard