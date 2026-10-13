import './StatusTag.css'

const StatusTag = ({estado}) => {
    return(
        <p className={'status-tag status-tag-' + estado}>{estado}</p>
    )
}

export default StatusTag
