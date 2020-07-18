import React, { Component, Fragment } from 'react';
import ColorPicker from './ColorPicker'
import WidthPicker from './WidthPicker'
import Nav from './Nav'
import constants from '../helpers/constants'
import { Button, Form } from 'react-bootstrap';
import { BackspaceFill, ArrowBarDown, ArrowBarUp, Check2Circle } from 'react-bootstrap-icons';
import axios from 'axios';
import { withRouter } from "react-router-dom";
import { loginState } from '../helpers/loginState';

class DrawingBoard extends Component {

    constructor() {
        super()
        this.state = {
            drawing: undefined,
            startTime: undefined,
            isPublic: false,
            isMouseDown: false,
        }
        this.canvas = undefined;
        this.ctx = undefined;

        this.handleMouseDown = this.handleMouseDown.bind(this);
        this.handleMouseDrag = this.handleMouseDrag.bind(this);
        this.handleMouseUp = this.handleMouseUp.bind(this);

        this.resetAndDrawAgain = this.resetAndDrawAgain.bind(this);
        this.setColor = this.setColor.bind(this);
        this.setWidth = this.setWidth.bind(this);
        this.toggleIsPublic = this.toggleIsPublic.bind(this);
        this.toggleOptionsBar = this.toggleOptionsBar.bind(this);
        this.setEraser = this.setEraser.bind(this);
        this.sendToServer = this.sendToServer.bind(this);
    }

    componentDidMount() {
        loginState(this.props);
        this.initCanvas();
    }

    initCanvas() {
        this.canvas = document.querySelector('canvas');
        this.ctx = this.canvas.getContext('2d');
        this.ctx.canvas.width = document.body.clientWidth;
        this.ctx.canvas.height = window.innerHeight;
    }

    closeAndOpenPath() {
        this.ctx.closePath();
        this.ctx.beginPath();
    }

    setColor(color) {
        this.closeAndOpenPath();
        this.ctx.strokeStyle = color.hex;
    }

    setWidth(width) {
        this.closeAndOpenPath();
        this.ctx.lineWidth = width;
    }

    handleMouseDown(e) {
        if (!this.state.startTime) this.setState({ startTime: new Date() });
        if (this.state.isMouseDown) return false;
        this.setState({ isMouseDown: true })
        this.ctx.moveTo(e.pageX, e.pageY);
    }

    handleMouseDrag(e) {
        if (!this.state.isMouseDown) return false;
        this.ctx.lineTo(e.pageX, e.pageY);
        this.ctx.stroke();
    }

    handleMouseUp(e) {
        this.setState({ isMouseDown: false, drawing: this.canvas.toDataURL() })
    }

    resetAndDrawAgain() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        var img = new Image();
        img.addEventListener("load", () => {
            this.ctx.drawImage(img, 0, 0);
        });
        img.setAttribute("src", this.state.drawing);
    }

    toggleIsPublic() {
        this.setState({
            isPublic: !this.state.isPublic
        })
    }

    toggleOptionsBar() {
        document.querySelector('.options').classList.toggle('open');
    }

    setEraser() {
        this.setColor({ hex: constants.whiteColor });
    }

    getTimeSpent(start, end) {
        const difference = end - start;

        const hours = Math.floor((difference % 86400000) / 3600000);
        const minutes = Math.round(((difference % 86400000) % 3600000) / 60000);
        const seconds = Math.round((((difference % 86400000) % 3600000) % 60000) / 1000);
        return `${hours}h, ${minutes}m, ${seconds}s`
    }

    sendToServer() {
        axios.post(`${constants.server}/drawings`, {
            drawing: this.state.drawing,
            isPublic: this.state.isPublic,
            timeSpent: this.getTimeSpent(this.state.startTime, new Date())
        }, { withCredentials: true }).then(() => {
            this.props.history.push("/");
        })
    }


    render() {
        return (
            <Fragment>
            <canvas id='canvas' onMouseDown={this.handleMouseDown} onMouseMove={this.handleMouseDrag} onMouseUp={this.handleMouseUp} />
            <div className='options'>
              <Nav />
              <section>
                <ColorPicker setColor={this.setColor}/>
                <WidthPicker setWidth={this.setWidth}/>
                <Button onClick={this.setEraser} value='Eraser'><BackspaceFill />&nbsp;Eraser</Button>
                <Form.Check value={this.state.isPublic} onChange={this.toggleIsPublic} type="checkbox" label="Make this drawing public?"/>
                <Button className='btn-success' onClick={this.sendToServer} value='Save'><Check2Circle />&nbsp;Save</Button>
              </section>
              <div onClick={this.toggleOptionsBar} className='pull-bar pointer'>
                <ArrowBarDown className='pull-bar-down' size={70} color='#4248ec'/>
                <ArrowBarUp className='pull-bar-up' size={70}/>
              </div>
            </div>
        </Fragment>
        )
    }
}

export default withRouter(DrawingBoard);