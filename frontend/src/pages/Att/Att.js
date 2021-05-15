import React from 'react';
import { Button,InputGroup,FormControl, Col } from 'react-bootstrap';
import bg from '../bg.jpg';
import HurbCard from '../../components/Hcard/Hcard'
import '../pages.scss'
import {exchanceIcon,money,coin,pig} from '../../utils/icons'
import CurrencyInput from '../../components/HMoneyInput/HCurrencyInput'
import HAlert from '../../components/Halert/Halert'
import {config} from '../../config/config'
import Hselect from '../../components/Hselect/Hselect'


class Att extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            loading: true,
            bg:bg,
            ldgBtn:false,
            ldgInfo:false,
            Halert:{
                show:false,
                msg:"",
                type:"",
                title:""
            },
            currency:{
                fictional:true,
                value:'',
                name:""
            }
        }
        this.save = this.save.bind(this);
        this.changeSelect = this.changeSelect.bind(this);
    }

    componentDidMount(){
        this.setState({loading:false});
    }

    async save(){
        this.setState({ldgBtn:true})
        console.log(this.state.currency)
        const {name,value,code}= this.state.currency
        if(name&&value&&code){
            fetch(config.API_URL + 'currency/'+code,{
                method: 'PATCH',
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

    changeSelect(currency){
        this.setState({ldgInfo:true})
        fetch(config.API_URL + 'currency/'+currency.value)
        .then(response => response.json())
        .then(json => {
            console.log(json)

            if(json.success){
                const {name,value,code} = json.data
                this.setState({
                    currency:{
                        ...this.state.currency,
                        name,
                        value,
                        code
                    },
                    ldgInfo:false
                })
            }else{
                this.setState({ldgInfo:true})
            }
        })
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
                    <h4>Atualizar dados de uma moeda Criada</h4>

                    <label>Codigo da moeda.</label>
                    <InputGroup className="mb-3 hsize">
                        <InputGroup.Prepend>
                            <InputGroup.Text className={(this.state.ldgInfo?'ld-btn':"")}>{money}</InputGroup.Text>
                        </InputGroup.Prepend>
                        <Hselect
                            name={"Selecione a moeda:"}
                            data={this.props.data}
                            change={(me)=>this.changeSelect(me)}
                            selected={this.state.selected}
                            className="borderStyle"
                        />
                    </InputGroup>
                    <label>Nome da moeda.</label>
                    <InputGroup className="mb-3 hsize">
                        <InputGroup.Prepend>
                            <InputGroup.Text className={(this.state.ldgInfo?'ld-btn':"")}>{coin}</InputGroup.Text>
                        </InputGroup.Prepend>
                        <FormControl
                            id="name"
                            placeholder="Gold pieces(D&D),Galeão(HP)"
                            aria-label="Code"
                            aria-describedby="basic-addon2"
                            value={this.state.currency.name}
                            disabled={this.state.ldgInfo}
                            onChange={(value)=>this.setState({currency:{...this.state.currency, name:value.target.value}})}
                        />
                    </InputGroup>
                    <label>Valor da moeda para a moeda de lastro (USD)</label>
                    <InputGroup className="mb-3 hsize">
                        <InputGroup.Prepend>
                            <InputGroup.Text className={(this.state.ldgInfo?'ld-btn':"")}>{pig}</InputGroup.Text>
                        </InputGroup.Prepend>
                        <CurrencyInput
                            className="borderStyle"
                            placeholder="$0.00"
                            disabled={this.state.ldgInfo}
                            value={this.state.currency.value}
                            type="text"
                            onChange={(value)=>this.setState({currency:{...this.state.currency, value:(value.target.value).replace(",","")}})}
                        />

                    </InputGroup>
                </Col>
                <Col>
                    <hr/>
                    <Button variant="primary" size="lg" className={(this.state.ldgBtn?'ld-btn':"")+' hurbSize'} onClick={()=>this.save()} disabled={this.state.ldgBtn}>
                        {exchanceIcon}<span>Atualizar</span>
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

export default Att