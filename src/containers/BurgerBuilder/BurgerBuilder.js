import React, { Component } from 'react';
import { connect } from 'react-redux';
import * as actions from '../../store/actions/index';
import axios from '../../axios-orders';

import Auxilliary from '../hoc/Auxilliary/Auxilliary';
import Burger from '../../components/Burger/Burger';
import BuildControls from '../../components/BuildControls/BuildControls';
import OrderSummary from '../../components/Burger/OrderSummary/OrderSummary';
import Spinner from '../../components/UI/Spinner/Spinner';
import withErrorHandler from '../hoc/withErrorHandler/withErrorHandler';
import Modal from '../../components/UI/Modal/Modal';


export class BurgerBuilder extends Component {

    state = {
        purchasing: false
    }

componentDidMount () {
    this.props.onInitIngredients();
}

updatePurchaseState (ingredients){
    const sum = Object.keys(ingredients)
    .map(igKey =>{
        return ingredients[igKey]
    })
    .reduce((sum, el)=>{
        return sum + el;
    }, 0);
    return sum > 0;
}

purchaseHandler = ()=>{
    if(this.props.isAuthenticated){
        this.setState({purchasing: true});
    } else {
        this.props.onSetAuthRedirectPath('/checkout');
        this.props.history.push('/auth');
    }
}

purchaseCancelHandler = () => {
    this.setState({purchasing : false});
}

purchaseContinueHandler = () =>{
    this.props.onInitPurchase();
    this.props.history.push('/checkout');
}

    render () {
        const disableInfo = {
            ...this.props.ings
        };
        for (let key in disableInfo){
            disableInfo[key] = disableInfo[key]<= 0
        }
        
        let orderSummary = null;
        let burger = this.props.error ? <p>Burger Ingredients Can't be Loaded!</p> : <Spinner/>; 

        if(this.props.ings){
            burger =  (
                    <Auxilliary>
                        <Burger ingredients={this.props.ings}/>
                        <BuildControls
                            ingredientAdded={this.props.onIngredientAdded}
                            ingredientRemoved={this.props.onIngredientRemoved}
                            disabled={disableInfo} 
                            purchasable={this.updatePurchaseState(this.props.ings)} 
                            ordered={this.purchaseHandler}
                            isAuth={this.props.isAuthenticated}
                            price={this.props.price}/>
                    </Auxilliary>
            );
            orderSummary = <OrderSummary 
                            ingredients={this.props.ings}
                            price={this.props.price}
                            purchaseCancelled = {this.purchaseCancelHandler}
                            purchaseContinued = {this.purchaseContinueHandler} />;
            }

        return (
            <Auxilliary>
                <Modal show={this.state.purchasing} modalClosed={this.purchaseCancelHandler} >
                    {orderSummary}
                </Modal> 
                {burger}
            </Auxilliary>
        );
    }
}

const mapStateToProps = state =>{
    return {
        ings: state.burgerBuilder.ingredients,
        price: state.burgerBuilder.totalPrice,
        error: state.burgerBuilder.error,
        isAuthenticated: state.auth.token !== null,
    };
};

const mapDispatchToProps = dispatch => {
    return {
        onIngredientAdded: (ingName)=> dispatch( actions.addIngredient(ingName) ),
        onIngredientRemoved: (ingName)=> dispatch( actions.removeIngredient(ingName) ),
        onInitIngredients: () => dispatch(actions.initIngredients() ),
        onInitPurchase: () => dispatch( actions.purchaseInit() ),
        onSetAuthRedirectPath: (path) => dispatch( actions.setAuthRedirectPath(path) ),
    };
}

export default connect(mapStateToProps, mapDispatchToProps)( withErrorHandler(BurgerBuilder, axios) );