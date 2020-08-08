import React from 'react';
import style from './style.module.css';
import Input from '../../../components/Input';
import Button from '../../../components/Button';
import OrderItem from '../../../components/OrderItem';

const OrderHall = (props) => {
  const onChangeName = (event) => {
    const name = event.target.value;
    props.dispatch({
      type:'changeName',
      payload:{name}
    })
  }

  const onChangeTable = (event) => {
    const table = event.target.value;
    props.dispatch({
      type:'changeTable',
      payload:{table}
    })
  }


  return (
    <section
      className={style.card}
    >
      <h2>
        Resumo do pedido
      </h2>
      {props.order.table}
      <Input
        onChange={onChangeName}
        label="atendente"
        id="nameOrder"
        type="text"
        value={props.order.name}
      />
      <Input
        onChange={onChangeTable}
        label="mesa"
        id="numberTable"
        type="number"
        value={props.order.table}
      />
      <ul>
      {props.order.products.map((prod) => (
        <OrderItem
        name={prod.name}
        count={prod.count}
        key={prod.name}
        onAdd={() => props.onAddProduct(prod)}
        onRemove={() => props.onRemoveProduct(prod)}
        />
      ))}
      </ul>
      <h3>
      {`Total ${props.order.total}`}
      </h3>
      <Button 
        type="send"
        className={style.buttonSend}
      >
        Enviar
      </Button>
      {props.children}
    </section>
    
  )
}

export default OrderHall;