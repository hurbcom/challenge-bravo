import React from 'react';
import './App.scss';
import { Container } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import Calc from './pages/Home/Calc'
import Form from './pages/Criar/Form'
import Att from './pages/Att/Att'
import {config} from './config/config'
import {
    BrowserRouter as Router,
    Switch,
    Route,
    Link
  } from "react-router-dom";

class App extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            loading: true,
            data : [],
            custom:[]
        };
        this.getInformations = this.getInformations.bind(this)
    }

    componentWillMount() {
        this.getInformations()
    }

    getInformations(){
        console.log("rodei")
        fetch(config.API_URL + 'currency/list')
        .then(response => response.json())
        .then(json => {
          this.formater(json.data)
        });
    }

    formater(data){
        let AllCurrencies = []
        let CustonCurrencies = []
        data.forEach((ele,key)=>{
            if(ele.value){
                let obj = {
                    label: ele.name + ` (${ele.code})`,
                    value: ele.code
                }
                AllCurrencies.push(obj)
                if(ele.fictional){
                    CustonCurrencies.push(obj)
                }
            }
        })

        this.setState({ data: AllCurrencies, custom: CustonCurrencies})
    }

    componentDidMount(){
        this.setState({loading:false});
    }


    render() {
        if(!this.state.loading){
        return (
            <div className="App">
                <Router>
            <header>
                    <svg width="98" height="30" fill="#3468fc" className="hrc-1nbWG" viewBox="0 0 98 30" data-reactid=".2gc7huk4xva.1.2.0.0.0.0.0.0.0.0"><defs data-reactid=".2gc7huk4xva.1.2.0.0.0.0.0.0.0.0.0"><path id="a" d="M0 .592h32.552V21.6H0z" data-reactid=".2gc7huk4xva.1.2.0.0.0.0.0.0.0.0.0.0"></path></defs><g fill="inherit" data-reactid=".2gc7huk4xva.1.2.0.0.0.0.0.0.0.0.1"><g transform="translate(0 8.334)" data-reactid=".2gc7huk4xva.1.2.0.0.0.0.0.0.0.0.1.0"><mask id="b" fill="#fff" data-reactid=".2gc7huk4xva.1.2.0.0.0.0.0.0.0.0.1.0.0"><use  data-reactid=".2gc7huk4xva.1.2.0.0.0.0.0.0.0.0.1.0.0.0"></use></mask><path d="M16.276 21.6C4.78 21.6-.446 13.624.03 1.75.03.87.837.593 2.262.593c1.33 0 2.422.184 2.376 1.159-.285 9.46 2.66 15.49 11.638 15.49 9.075 0 12.02-6.169 11.64-15.49C27.867.776 28.96.59 30.29.59c1.425 0 2.232.279 2.232 1.16.475 12.01-4.845 19.849-16.247 19.849" data-reactid=".2gc7huk4xva.1.2.0.0.0.0.0.0.0.0.1.0.1"></path></g><path d="M9.034 7.888l.048 6.882c0 .989 1.014 1.272 2.174 1.225 1.496-.048 2.413-.376 2.317-1.366a202.643 202.643 0 0 1-.418-4.809 87.439 87.439 0 0 1 3.121-.047c1.305 0 2.21.069 3.069.123a210.404 210.404 0 0 1-.413 4.733c-.097.99.82 1.318 2.317 1.366 1.16.047 2.172-.236 2.172-1.225l.05-6.882c.145-2.78.386-4.195.675-6.362C24.243.583 23.47.11 21.925.017c-1.303-.094-2.365.189-2.365 1.178a78.03 78.03 0 0 1-.02 5.181c-2.306.108-4.429.11-6.576-.01a77.745 77.745 0 0 1-.019-5.171c0-.99-1.062-1.272-2.365-1.178-1.546.094-2.318.566-2.221 1.509.289 2.167.53 3.582.675 6.362m29.995 16.523h4.342v-8.663a4.007 4.007 0 0 1 1.023-.677 3.105 3.105 0 0 1 1.353-.289c.536 0 .964.148 1.287.44.321.296.483.829.483 1.601v7.588h4.342v-8.828c0-1.38-.367-2.462-1.1-3.243-.734-.781-1.749-1.172-3.046-1.172a4.93 4.93 0 0 0-2.394.607c-.743.404-1.4.929-1.976 1.572l.026-7.13h-4.34V24.41zm25.096-4.028c-.258.24-.571.441-.94.607a2.997 2.997 0 0 1-1.241.248c-.554 0-.986-.152-1.299-.456-.313-.302-.47-.84-.47-1.614v-7.586h-4.342v8.828c0 1.38.358 2.46 1.074 3.243.717.781 1.717 1.172 3.003 1.172.856 0 1.646-.198 2.372-.594a7.284 7.284 0 0 0 1.843-1.393v1.573h4.342V11.582h-4.342v8.8zm32.886-5.311c-.28-.819-.662-1.518-1.148-2.098a4.974 4.974 0 0 0-1.751-1.338 5.292 5.292 0 0 0-2.227-.468c-.842 0-1.56.184-2.158.551a7.806 7.806 0 0 0-1.512 1.187l.025-6.689h-4.339v18.608l4.062-.552c.428.147.92.272 1.47.372.55.101 1.04.153 1.471.153.877 0 1.714-.162 2.507-.483a6.165 6.165 0 0 0 2.088-1.394 6.604 6.604 0 0 0 1.414-2.194c.346-.854.518-1.815.518-2.882 0-1.03-.14-1.955-.42-2.773m-4.67 5.573c-.498.654-1.21.98-2.132.98-.776 0-1.431-.175-1.966-.526v-5.655c.294-.257.608-.47.942-.635.33-.166.738-.247 1.218-.247.885 0 1.555.307 2.008.924.452.617.678 1.476.678 2.579 0 1.066-.25 1.927-.748 2.58m-11.704-9.02a4.1 4.1 0 0 0-1.18-.179c-1.237 0-2.211.648-2.924 1.944v-1.836h-4.045v12.857h4.045v-7.32c.894-2.11 3.558-1.788 4.104-1.692v-3.774z" data-reactid=".2gc7huk4xva.1.2.0.0.0.0.0.0.0.0.1.1"></path></g></svg>
                    <ul className='navList'>
                        <li>
                            <Link to="/">Calculadora</Link>
                        </li>
                        <li>
                            <Link to="/Moedas">Moedas</Link>
                        </li>
                        <li>
                            <Link to="/Atualizar">Atualizar</Link>
                        </li>
                    </ul>
                </header>
                <Container>
                    <div className='warperBody'>
                    <Switch>
                        <Route exact path="/">
                            <Calc data={this.state.data} />
                        </Route>
                        <Route path="/Moedas">
                            <Form data={this.state.data} onSave={this.getInformations}/>
                        </Route>
                        <Route path="/Atualizar">
                            <Att data={this.state.custom} onSave={this.getInformations}/>
                        </Route>
                    </Switch>
                    </div>
                </Container>
            </Router>
            </div>
        )
        }else{
            return ""
        }
    }
}

export default App;
