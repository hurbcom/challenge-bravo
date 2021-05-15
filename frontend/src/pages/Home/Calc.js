import React from 'react';
import { Button,InputGroup,Col } from 'react-bootstrap';
import bg from '../bg.jpg';
import HurbCard from '../../components/Hcard/Hcard'
import Hselect from '../../components/Hselect/Hselect'
import '../pages.scss'
import {exchanceIcon,money,moneyCoin} from '../../utils/icons'
import CurrencyInput from '../../components/HMoneyInput/HCurrencyInput'
import {config} from '../../config/config'

class Calc extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            loading: true,
            bg:bg,
            selected1:null,
            selected2:null,
            amount:0,
            res:false,
            ldgBtn:false
        }
        this.changeSelect = this.changeSelect.bind(this);
        this.send = this.send.bind(this);
    }

    componentDidMount(){
        this.setState({loading:false});
    }

    changeSelect(witch,element){

       if(witch===1){
           this.setState({selected1:element.value})
       }else{
        this.setState({selected2:element.value})
       }
    }
    async send(){
        this.setState({ldgBtn:true})
        let from    = this.state.selected1
        let to      = this.state.selected2
        let amount  = this.state.amount
        const endpoint = `currency/transform/${from}/${to}/${amount}`
        fetch(config.API_URL + endpoint)
            .then(response => response.json())
            .then(json => {
                this.setState({res:json.data})
                this.setState({ldgBtn:false})
        });
    }



    render() {
        if(!this.state.loading){
            return (
                <HurbCard
                image ={this.state.bg}
                title='Calculadora'
                subtitle="Projeto para a HURB"
                >
                <Col>
                    <h4>Converter valores</h4>
                    <InputGroup className="mb-3 hsize">
                        <InputGroup.Prepend>
                            <InputGroup.Text>{money}</InputGroup.Text>
                        </InputGroup.Prepend>
                        <Hselect
                            name={"Selecione a moeda de origem:"}
                            data={this.props.data}
                            change={(me)=>this.changeSelect(1,me)}
                            selected={this.state.selected1}
                        />
                    </InputGroup>
                    <br/>
                    <InputGroup className="mb-3 hsize">
                        <InputGroup.Prepend>
                            <InputGroup.Text>{money}</InputGroup.Text>
                        </InputGroup.Prepend>
                        <Hselect
                            name={"Selecione a moeda de destino:"}
                            data={this.props.data}
                            change={(me)=>this.changeSelect(2,me)}
                            selected={this.state.selected2}
                            className="borderStyle"
                        />
                    </InputGroup>

                    <br/>

                    <InputGroup className="mb-3 hsize">
                        <InputGroup.Prepend>
                            <InputGroup.Text>{moneyCoin}</InputGroup.Text>
                        </InputGroup.Prepend>
                        <CurrencyInput className="borderStyle" placeholder="$0.00" type="text" onChange={(res)=>this.setState({amount:(res.target.value).replace(",","")}) }/>
                    </InputGroup>
                </Col>
                {this.state.res?
                <Col>
                    <span className='transform'>$ {(this.state.res.result).toFixed(2)}</span>
                </Col>
                :""}
                <Col>
                    <hr/>
                    <Button variant="primary" size="lg" className={(this.state.ldgBtn?'ld-btn':"")+' hurbSize'} onClick={()=>this.send()} disabled={this.state.ldgBtn}>
                        {exchanceIcon}<span>Calcular</span>
                    </Button>
                </Col>
            </HurbCard>
            )
        }else{
            return ''
        }
    }
}

export default Calc