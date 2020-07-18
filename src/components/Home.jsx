import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import constants from '../helpers/constants'
import { TrashFill, ChevronRight } from 'react-bootstrap-icons';
import { loginState } from '../helpers/loginState';
import Nav from './Nav'
import { withRouter } from "react-router-dom";

const Home = (props) => {
    let [drawingState, updateDrawingState] = useState({
        drawingsList: {}
    });
    let currentUserId = useRef(0);

    useEffect(() => {
        const getLoginStatus = async () => {
            let _userId = await loginState(props);
            if (_userId) {
                currentUserId.current = _userId;
            } else {
                return
            }
            getDrawingDataForHomePage();

        }
        getLoginStatus();
    }, [])

    const getDrawingDataForHomePage = () => {
        axios.get(`${constants.server}/drawings`, { withCredentials: true }).then((data) => {
            updateDrawingDataForHomePage(data) //{<username>:[{drawing,isPublic,timeSpent}]}
        })
    }

    const updateDrawingDataForHomePage = (data) => {
        updateDrawingState({ ...drawingState, drawingsList: data.data })
    }

    const deleteDrawing = (index) => {
        axios.delete(`${constants.server}/drawings/${index}`, { withCredentials: true }).then((data) => {
            getDrawingDataForHomePage()
        })
    }

    const renderDrawingsList = () => {
        let list = [];
        let _keys = Object.keys(drawingState.drawingsList);
        for (let i = 0; i < _keys.length; i++) {
            let userData = drawingState.drawingsList[_keys[i]];
            for (let index = 0; index < userData.length; index++) {
                let drawingInfo = userData[index];
                list.push(
                    <li key={Math.random(0,100)}>
					<span><img alt='img' src={drawingInfo.drawing}/></span>
					<div className='info-wrapper'>
					<span>Artist: {_keys[i]} {currentUserId.current === _keys[i]?'(You!)':''}</span>
					<ChevronRight />
					<span>Time Spent: {drawingInfo.timeSpent}</span>
					
					{currentUserId.current === _keys[i] ? <span className='pointer' onClick={() => {deleteDrawing(index)}}><ChevronRight /><TrashFill /></span>:''}
					</div>
				</li>
                )
            }
        }
        return list;
    }
    return (
        <section>
	  	<Nav />
	  	<article className='drawingPage text-center mt-5'>
	  	<h1 className=' mb-3'>Drawings by all our amazing artists</h1>
	    <ul className='drawingList'>
	    {renderDrawingsList()}
	    </ul>
	    </article>
	    </section>
    )
}

export default withRouter(Home);