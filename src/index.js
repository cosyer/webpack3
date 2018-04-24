import _ from 'lodash';
import Print from './print';
import React from 'react'
import ReactDOM from 'react-dom'
import Image from "./images/webpack.png"
import './index.css'
import './index.less'

class App extends React.Component {
    render() {
        return (
            <div>
                <img src={Image} alt='webpack' className="image" />
                <button className="leesBox"></button>
            </div>
        )
    }
}

function component() {
    console.log(api_host)
    let element = document.createElement('div');

    // lodash 是由当前 script 脚本 import 导入进来的
    element.innerHTML = _.join(['Hello', ' webpack3'], '');
    element.onclick = Print.bind(null, 'Hello webpack3!');

    return element;
}
ReactDOM.render(<App />, document.getElementById("app"))
document.body.appendChild(component());