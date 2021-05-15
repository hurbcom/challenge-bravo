import React from 'react';
import { Button,InputGroup,Col } from 'react-bootstrap';
import bg from '../bg.jpg';
import HurbCard from '../../components/Hcard/Hcard'
import Hselect from '../../components/Hselect/Hselect'
import '../pages.scss'
import {exchanceIcon,money,moneyCoin,pig} from '../../utils/icons'
import CurrencyInput from '../../components/HMoneyInput/HCurrencyInput'
import {config} from '../../config/config'
import HAlert from '../../components/Halert/Halert'


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
            ldgBtn:false,
            Halert:{
                show:false,
                msg:"",
                type:"",
                title:""
            }
        }
        this.changeSelect = this.changeSelect.bind(this);
        this.send = this.send.bind(this);
    }

    // valida se o componente ja esta disponivel
    componentDidMount(){
        this.setState({loading:false});
    }

    // função para salvar no state o valor dos selects
    changeSelect(witch,element){
       if(witch===1){
           this.setState({selected1:element.value})
       }else{
        this.setState({selected2:element.value})
       }
    }

    // função apr ao envio da converção das moedas
    async send(){

        this.setState({ldgBtn:true})
        let from    = this.state.selected1
        let to      = this.state.selected2
        let amount  = this.state.amount

        if(from,to,amount){
            const endpoint = `currency/transform/${from}/${to}/${amount}`
            fetch(config.API_URL + endpoint)
            .then(response => response.json())
            .then(json => {
                console.log(json)
                this.setState({res:json.data})
                this.setState({ldgBtn:false})
            });
        }else{
            this.setState(
                {
                    Halert:{
                        ...this.state.Halert,
                        msg: "Preencha todos os campos",
                        type:"info",
                        title: "Reveja os dados",
                        show:true
                    }
                }
            )
        }
    }
    /*
      onCLick - Captura o clino ok do swal para atualizar o front
      TODO Ainda precisa melhorar levar para um service ou algo do tipo externar para não haver repetição de codigo.
    */
    onCLick = ()=>{
        this.setState({
            Halert:{...this.state.Halert, show:false},
            ldgBtn:false,
            currency:{
                ...this.state.currency,
                name:undefined,
                code:undefined,
                value:undefined

            }
        })
        this.forceUpdate();
    }

    render() {
        if(!this.state.loading){
            return (
                <>
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
                <Col>
                    <hr/>
                    <Button variant="primary" size="lg" className={(this.state.ldgBtn?'ld-btn':"")+' hurbSize'} onClick={()=>this.send()} disabled={this.state.ldgBtn}>
                        {exchanceIcon}<span>Calcular</span>
                    </Button>
                </Col>
                <Col className={"result "+(this.state.selected2?"":"empty")}>
                    <span>Valor transformado de {this.state.selected1} para {this.state.selected2}</span>
                <InputGroup className="mb-3 hsize">
                        <InputGroup.Prepend>
                            <InputGroup.Text>{pig}</InputGroup.Text>
                        </InputGroup.Prepend>
                        <div className="borderStyle d-flex">
                            {this.state.res?
                            //    <span className="transform d-flex a-c"> $ {(this.state.res.result).toFixed(2)}</span>
                            <CurrencyInput className="noBorder" placeholder="$0.00" type="text" value={(this.state.res.result).toFixed(2)} />

                            :""}
                        </div>
                    </InputGroup>
                </Col>
            </HurbCard>
            <HAlert
                onConfirm={()=>this.onCLick()}
                title={this.state.Halert.title}
                type={this.state.Halert.type}
                show={this.state.Halert.show}
            >
                <p>{this.state.Halert.msg}</p>
            </HAlert>
            </>
            )
        }else{
            return ''
        }
    }
}

export default Calc