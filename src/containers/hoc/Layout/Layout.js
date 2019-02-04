import React, { Component } from 'react';
import Toolbar from '../../../components/Navigation/Toolbar/Toolbar';
import Auxilliary from '../Auxilliary/Auxilliary';
import classes from './Layout.css';
import SideDrawer from '../../../components/Navigation/SideDrawer/SideDrawer';

class Layout extends Component {

    state = {
        showSideDrawer: false
    };

    closedSideDrawerHandler = () =>{
        this.setState({showSideDrawer : false});
    }

    sideDrawerToggleClicked = () =>{
        this.setState( ( prevState ) => {
           return { showSideDrawer: !prevState.showSideDrawer };
    });
}

    render (){
        return (
            <Auxilliary>
                <Toolbar drawerToggleClicked={this.sideDrawerToggleClicked}/>
                    <SideDrawer 
                        open={this.state.showSideDrawer} 
                        closed={this.closedSideDrawerHandler}/>
                    <main className={classes.Content}>
                        {this.props.children}
                    </main>
            
            </Auxilliary>
        )
    }
};


export default Layout;