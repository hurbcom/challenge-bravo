import React from 'react';
import './App.scss';
import { Container, Nav } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import Calc from './pages/Home/Calc'
import Form from './pages/Criar/Form'
import Att from './pages/Att/Att'
import {config} from './config/config'
import {
    BrowserRouter,
    Switch,
    Route,
    NavLink
  } from "react-router-dom";
import {logo} from './utils/icons'

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
    //função de disparo da rotina de pegar os valores
    componentWillMount() {
        this.getInformations()
    }

    // função para pegar os valores
    getInformations(){
        fetch(config.API_URL + 'currency/list')
        .then(response => response.json())
        .then(json => {
          this.formater(json.data)
        });
    }

    // função apra formatar od dados recebidos para o modo do select
    formater(data){
        let AllCurrencies = []
        let CustonCurrencies = []
        data.forEach((ele,key)=>{

            //validação se o valor n é nulo e não tem caractere especial. solução rapida por falta de tempo em modo convencional isso seria uma divida técnica
            if(ele.value && !ele.name.includes('�')){
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

    // valida se o componente ja esta disponivel
    componentDidMount(){
        this.setState({loading:false});
    }


    render() {
        if(!this.state.loading){
        return (
            <div className="App">
                <BrowserRouter>
            <header className="container">
                    {logo}
                    <Nav className='navList'>
                        <NavLink exact={true} to="/">Calculadora</NavLink>
                        <NavLink exact={true} to="/Moedas">Moedas</NavLink>
                        <NavLink exact={true} to="/Atualizar">Atualizar</NavLink>
                    </Nav>
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
            </BrowserRouter>
            </div>
        )
        }else{
            return ""
        }
    }
}

export default App;
