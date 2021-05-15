import React from 'react';
import { Button,InputGroup,FormControl, Col } from 'react-bootstrap';
import bg from '../bg.jpg';
import HurbCard from '../../components/Hcard/Hcard'
import '../pages.scss'
import {exchanceIcon,pig,money,coin} from '../../utils/icons'
import CurrencyInput from '../../components/HMoneyInput/HCurrencyInput'
import HAlert from '../../components/Halert/Halert'
import {config} from '../../config/config'



class Form extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            loading: true,
            bg:bg,
            ldgBtn:false,
            Halert:{
                show:false,
                msg:"",
                type:"",
                title:""
            },
            currency:{
                fictional:true
            }
        }
        this.save = this.save.bind(this);
    }
    // valida se o componente ja esta disponivel
    componentDidMount(){
        this.setState({loading:false});
    }


    /*
      save - função para salvar os dados inseridos na tela e criar com isso uma nova moeda. os valores
      serão validados no frontend para caso os dados foram preenchidos e no
      backend se existe alguma moeda com o mesmo código e se os dados passados atendem as expectativas
    */
    async save(){
        this.setState({ldgBtn:true})
        const {name,value,code}= this.state.currency
        if(name&&value&&code){
            fetch(config.API_URL + 'currency',{
                method: 'POST',
                headers: {"content-type": "application/json"},
                body: JSON.stringify(this.state.currency)
            })
            .then(response => response.json())
            .then(json => {
                if("success" in json && json.success){
                    this.setState({ldgBtn:false})
                    this.setState(
                        {
                            Halert:{
                                ...this.state.Halert,
                                msg: "Salvo com sucesso",
                                type:"success",
                                title: "Sucesso",
                                show:true
                            },
                            currency:{
                                ...this.state.currency,
                                name:"",
                                value:"",
                                code:""
                            }
                        }
                    )
                    this.props.onSave()
                }else{
                    let msg=""
                    if("details" in json.data){
                        msg = json.data.details[0].message
                    }else{
                        msg = json.data.errors[0].message
                    }
                    this.setState(
                        {
                            Halert:{
                                ...this.state.Halert,
                                msg: msg,
                                type:"danger",
                                title: "Falha",
                                show:true
                            }
                        }
                    )
                }
            })
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
                    <h4>Cadastrar novas Moedas</h4>
                    <label>Nome da moeda.</label>
                    <InputGroup className="mb-3 hsize">
                        <InputGroup.Prepend>
                            <InputGroup.Text>{coin}</InputGroup.Text>
                        </InputGroup.Prepend>
                        <FormControl
                            id="name"
                            placeholder="Gold pieces(D&D),Galeão(HP)"
                            aria-label="Code"
                            aria-describedby="basic-addon2"
                            onChange={(value)=>this.setState({currency:{...this.state.currency, name:value.target.value}})}
                        />
                    </InputGroup>
                    <label>Codigo da moeda.</label>
                    <InputGroup className="mb-3 hsize">
                        <InputGroup.Prepend>
                            <InputGroup.Text>{money}</InputGroup.Text>
                        </InputGroup.Prepend>
                        <FormControl
                            id="code"
                            placeholder="USD,BRL,GP"
                            aria-label="Code"
                            aria-describedby="basic-addon2"
                            onChange={(value)=>this.setState({currency:{...this.state.currency, code:value.target.value}})}
                        />
                    </InputGroup>
                    <label>Valor da moeda para a moeda de lastro (USD)</label>
                    <InputGroup className="mb-3 hsize">
                        <InputGroup.Prepend>
                            <InputGroup.Text>{pig}</InputGroup.Text>
                        </InputGroup.Prepend>
                        <CurrencyInput
                            className="borderStyle"
                            placeholder="$0.00"
                            type="text"
                            onChange={(value)=>this.setState({currency:{...this.state.currency, value:(value.target.value).replace(",","")}})}
                        />
                    </InputGroup>
                </Col>
                <Col>
                    <hr/>
                    <Button variant="success" size="lg" className={(this.state.ldgBtn?'ld-btn':"")+' hurbSize'} onClick={()=>this.save()} disabled={this.state.ldgBtn}>
                        {exchanceIcon}<span>Salvar</span>
                    </Button>
                </Col>
            </HurbCard>
            <HAlert
                onConfirm={()=>this.setState({Halert:{...this.state.Halert, show:false},ldgBtn:false})}
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

export default Form