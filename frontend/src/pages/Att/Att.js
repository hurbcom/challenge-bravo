import React from 'react';
import { Button,InputGroup,FormControl, Col, SafeAnchor } from 'react-bootstrap';
import bg from '../bg.jpg';
import HurbCard from '../../components/Hcard/Hcard'
import '../pages.scss'
import {exchanceIcon,money,coin,pig,pencil,trash} from '../../utils/icons'
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
        this.update = this.update.bind(this);
        this.delete = this.delete.bind(this);
        this.onCLick = this.onCLick.bind(this);
        this.changeSelect = this.changeSelect.bind(this);
    }
    // valida se o componente ja esta disponivel
    componentDidMount(){
        this.setState({loading:false});
    }
    /*
      update - função para atualizar os dados de uma moeda com os dados inseridos na tela . os valores
      serão validados no frontend para caso os dados foram preenchidos e no
      backend se existe alguma moeda com o mesmo código e se os dados passados atendem as expectativas
    */
    async update(){
        this.setState({ldgBtn:true})
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

    /*
      changeSelect - pega os dados de uma moeda no backend
    */

    changeSelect(currency){
        this.setState({ldgInfo:true})
        fetch(config.API_URL + 'currency/'+currency.value)
        .then(response => response.json())
        .then(json => {

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
                this.setState(
                    {
                        Halert:{
                            ...this.state.Halert,
                            msg: "Esta moeda ja não se encontra no nosso banco favor recarregar a página",
                            type:"Danger",
                            title: "Falha",
                            show:true
                        },
                        ldgInfo:false
                    }
                )
            }
        })
    }
     /*
      delete - Apaga uma moeda usando seu código de referência.
    */

    delete(){
        this.setState({ldgInfo:true})
        const {name,value,code}=this.state.currency
        if(name&&value&&code){

        fetch(config.API_URL + 'currency/'+this.state.currency.code,{
            method: 'DELETE',
            headers: {"content-type": "application/json"}
        })
        .then(response => response.json())
        .then(json => {

            if(json.success){
                this.setState(
                    {
                        Halert:{
                            ...this.state.Halert,
                            msg: "Deletado com sucesso",
                            type:"success",
                            title: "Sucesso",
                            show:true
                        },
                        currency:{
                            ...this.state.currency,
                            name:undefined,
                            code:undefined,
                            value:undefined

                        },
                        ldgInfo:false
                    }
                )
                this.props.onSave()

            }else{
                this.setState(
                    {
                        Halert:{
                            ...this.state.Halert,
                            msg: "Algo de errado não está certo",
                            type:"danger",
                            title: "Falha",
                            show:true
                        }
                    }
                )
                this.setState({ldgInfo:false})
            }
        })
        }else{
            this.setState(
                {
                    Halert:{
                        ...this.state.Halert,
                        msg: "Escolha a moeda",
                        type:"info",
                        title: "Reveja os dados",
                        show:true
                    }
                }
            )
            this.setState({ldgInfo:false})
        }
    }
    /*
      onCLick - Captura o clino ok do swal para atualizar o front
      TODO Ainda precisa melhorar.
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
                    <div className="d-flex djc-sb w80">
                        <Button variant="danger" size="lg" className={(this.state.ldgBtn?'ld-btn':"")+' hurbSize mr-10'} onClick={()=>this.delete()} disabled={this.state.ldgBtn}>
                            {trash}<span>Deletar</span>
                        </Button>
                        <Button variant="primary" size="lg" className={(this.state.ldgBtn?'ld-btn':"")+' hurbSize'} onClick={()=>this.update()} disabled={this.state.ldgBtn}>
                            {pencil}<span>Atualizar</span>
                        </Button>
                    </div>
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

export default Att