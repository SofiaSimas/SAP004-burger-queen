import React, { useState, useEffect, useReducer } from "react";
import { useParams } from "react-router-dom";
import ProductList from "./ProductList";
import NavComponent from "../../components/NavComponent";
import NavItem from "../../components/NavItem";
import firebase from "../../utils/firebase";
import style from "./style.module.css";
import OrderHall from "./OrderHall";

const orderInitialState = {
  name: "",
  table: 0,
  products: [],
  total: 0,
  status: "new",
  createdAt: null,
};

const nextState = {
  new: "inProgress",
  inProgress: "toDelivery",
  toDelivery: "ready",
};

const calculateTotal = (products) => {
  return products.reduce((accumulator, item) => {
    return accumulator + item.price * item.count;
  }, 0);
};

const getProductIndex = (state, product) => {
  return state.products.findIndex((item) => {
    return item.name === product.name;
  });
};

const addProduct = (state, product) => {
  const index = getProductIndex(state, product);
  if (index === -1) {
    state.products.push({ ...product, count: 1 });
  } else {
    state.products[index].count += 1;
  }
  state.total = calculateTotal(state.products);
  return state;
};

const removeProduct = (state, product) => {
  const index = getProductIndex(state, product);
  if (index !== -1) {
    const count = state.products[index].count;
    if (count === 1) {
      state.products.splice(index, 1);
    } else {
      state.products[index].count -= 1;
    }
  }
  state.total = calculateTotal(state.products);
  return state;
};

const orderReducer = (state, action) => {
  switch (action.type) {
    case "changeName":
      return {
        ...state,
        name: action.payload.name,
      };
    case "changeTable":
      return {
        ...state,
        table: action.payload.table,
      };
    case "addProduct":
      return addProduct(state, action.payload.product);
    case "removeProduct":
      return removeProduct(state, action.payload.product);
    case "changeStatus": {
      const newState = {
        ...state,
        status: nextState[state.status],
        createdAt: new Date().getTime(),
      };
      if (newState.status === "inProgress") {
        firebase.firestore().collection("orders").add(newState);
      }
      return newState;
    }
    default:
      throw new Error();
  }
};

const PageHall = () => {
  const [products, setProducts] = useState([]);
  const [category, setCategory] = useState("breakfast");
  const [orders, setOrders] = useState([]);
  const [order, orderDispatch] = useReducer(orderReducer, orderInitialState);
  let { status } = useParams();

  const onChangeStatus = () => {
    orderDispatch({
      type: "changeStatus",
    });
  };

  const addProduct = (product) => {
    orderDispatch({
      type: "addProduct",
      payload: { product },
    });
  };

  const removeProduct = (product) => {
    orderDispatch({
      type: "removeProduct",
      payload: { product },
    });
  };

  useEffect(() => {
    firebase
      .firestore()
      .collection("orders")
      .where("status", "==", status)
      .onSnapshot((orderList) => {
        const itens = [];
        orderList.forEach((doc) => {
          itens.push(doc.data());
        });
        setOrders(itens);
      });
  }, [orders, setOrders, status]); //firebase

  useEffect(() => {
    firebase
      .firestore()
      .collection("menu")
      .where("category", "==", category)
      .onSnapshot((menuItens) => {
        const itens = [];
        menuItens.forEach((doc) => {
          itens.push(doc.data());
        });
        setProducts(itens);
      });
  }, [products, setProducts, category]); //firebase

  return (
    <section className={style.container}>
      <NavComponent>
        <NavItem to="/hall/newOrder">Pedidos Novos</NavItem>
        <NavItem to="/hall/toDelivery">Aguardando Entrega</NavItem>
        <NavItem to="/hall/ready">Pedidos entregues</NavItem>
      </NavComponent>
      {status}
      {status === "newOrder" ? (
        <section className={style.cardProductOrder}>
          <ProductList
            onAddProduct={addProduct}
            onChangeCategory={setCategory}
            products={products}
          />
          <OrderHall
            order={order}
            dispatch={orderDispatch}
            onAddProduct={addProduct}
            onRemoveProduct={removeProduct}
            onChangeStatus={onChangeStatus}
          />
        </section>
      ) : (
        <div>
          {orders.map((orderItem) => (
            <p key={`${orderItem.name} ${orderItem.table} ${orderItem.total}`}>
              {orderItem.name}
              {orderItem.table}
              {orderItem.status}
            </p>
          ))}
        </div>
      )}
    </section>
  );
};

export default PageHall;
