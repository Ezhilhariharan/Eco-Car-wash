import { Component } from "react";
import { Route, Switch, withRouter } from "react-router";
import ViewCleaner from "./Components/viewCleaner/ViewCleaner"
import ListCleaner from "./Components/listCleaner/ListCleaner";

let url;

class CleanerLayout extends Component{
    constructor(props){
        super(props)
        url = this.props.match.path
    }

    render(){
        return(
            <div style={{height: "100%"}}>
                <Switch>
                    <Route exact path={`${url}`} component={ListCleaner} />
                    <Route path={`${url}/:username`} component={ViewCleaner} />
                </Switch>
            </div>
        )
    }
}

export default withRouter(CleanerLayout);

