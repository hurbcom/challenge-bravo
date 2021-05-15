/****************************************************************************

 WARPER DO SWEETALERT

*****************************************************************************/

import SweetAlert from 'react-bootstrap-sweetalert';

const HAlert = (props)=>{
    return(
            <SweetAlert
                title={props.title|| ""}
                show={props.show}
                onConfirm={props.onConfirm}
                confirmBtnText={props.confirmText || "Ok"}
                onCancel={props.onCancel || null}
                cancelBtnText={props.cancelText || "Cancelar"}
                btnSize={props.btnSize || 'md'}
                confirmBtnBsStyle={props.confirmBtnBsStyle || 'primary'}
                cancelBtnBsStyle={props.cancelBtnBsStyle || 'danger'}
                showCancel={props.onCancel?true:false}
                allowEscape={false}
                type={props.type || "default"}
                openAnim={true}
                closeAnim={true}
                >
            {props.children}
            </SweetAlert>
    )

}
export default HAlert