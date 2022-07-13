import React, { Component } from 'react'

interface LoadingProps {
    side?: number
    withText: Boolean
}
interface LoadingState{
    intervalId?: NodeJS.Timer,
    angle: number
}
export default class Loading extends Component<LoadingProps, LoadingState> {
    constructor(props: LoadingProps) {
        super(props);
        
        this.state = {
            intervalId: undefined,
            angle: 0
        };
    }
    
    componentDidMount() {
        const id = setInterval(()=>{
            let { angle } = this.state;
            if(angle === 350) angle = -10;
            this.setState({angle: angle+10});
        }, 50);
        this.setState({intervalId: id})
    }
    
    componentWillUnmount() {
        clearInterval(this.state.intervalId);
    }
    
    render() {
        const { angle } = this.state;
        const { side, withText } = this.props;
        const style = {transform: `rotate(${angle}deg)`, width: 35, height: 35};
        
        if(side) {
            style.width = side;
            style.height = side;
        }
        
        return <div className="loading d-flex flex-row">
            <img src="/loadinglogo.png" alt="Загрузка..." style={style}/>
            {withText 
                ? <h3>Загрузка...</h3>
                : null }
        </div>
    }

}