import React, { Component, ChangeEvent, MouseEvent } from 'react';
import { Guest } from './Guest';
import { isRecord } from './record';

export type NewGuest = {
    name: string,
    guest_of: string,
    family: boolean
}

type AddGuestProps = {
    // onStartClick: (info: NewGuest) => void,
    doBackClick: () => void
  };

type AddGuestState = {
    name: string,
    guest_of: string,
    family: boolean
    error: string
  };


// Allows the user to add a new guest
export class AddGuest extends Component<AddGuestProps, AddGuestState> {

    constructor(props: AddGuestProps) {
      super(props);
      this.state = {name: "", guest_of: "", family: false, error: ""};
    }
  
    render = (): JSX.Element => {
      return (
        <div>
          <h2>Add Guest</h2>
          <div>
            <label htmlFor="name">Name:</label>
            <input id="name" type="text" value={this.state.name}
                onChange={this.doNameChange}></input>
          </div>
          <br></br> 
            <legend>Guest of:</legend>
            <div>
             <input type="radio" id="Molly" name="host" value="Molly" onChange={this.doHostMollyChange} />
            <label htmlFor="Molly">Molly</label>
            </div>
            <div>
                <input type="radio" id="James" name="host" value="James" onChange={this.doHostJamesChange}/>
                <label htmlFor="James">James</label>
            </div>
        <br></br>

        <div>
            <input type="checkbox" id="Family" onChange={this.doFamilyChange}></input>
            <label htmlFor="Family">Family</label>
        </div>
        <br></br>
          <button type="button" onClick={this.doStartClick}>Start</button>
          <button type="button" onClick={this.doBackClick}>Back</button>
          {this.renderError()}
        </div>);
    };
  
    renderError = (): JSX.Element => {
      if (this.state.error.length === 0) {
        return <div></div>;
      } else {
        const style = {width: '300px', backgroundColor: 'rgb(246,194,192)',
            border: '1px solid rgb(137,66,61)', borderRadius: '5px', padding: '5px' };
        return (<div style={{marginTop: '15px'}}>
            <span style={style}><b>Error</b>: {this.state.error}</span>
          </div>);
      }
    };
  
    doNameChange = (evt: ChangeEvent<HTMLInputElement>): void => {
      this.setState({name: evt.target.value, error: ""});
    };
  
    doHostMollyChange = (_evt: ChangeEvent<HTMLInputElement>): void => {
      this.setState({guest_of: "Molly"});
    };

    doHostJamesChange = (_evt: ChangeEvent<HTMLInputElement>): void => {
        this.setState({guest_of: "James"});
    };

    doFamilyChange = (evt: ChangeEvent<HTMLInputElement>): void => {
        if (evt.target.checked) {
            this.setState({family: true});
        } else {
            this.setState({family: false});
        }
    };

    // doStartClick = (_: MouseEvent<HTMLButtonElement>): void => {
    //     if (this.state.guest_of === "") {
    //         this.setState({error: " Host is required"});
    //         return;
    //     }
    //     this.props.onStartClick({name: this.state.name, guest_of: this.state.guest_of, family: this.state.family});
    // };

    doStartClick = (_: MouseEvent<HTMLButtonElement>): void => {
        if (this.state.guest_of === "") {
            this.setState({error: " Host is required"});
            return;
        }
        const args: Guest = {name: this.state.name, guest_of: this.state.guest_of, family: this.state.family, 
                plus_one: false, tag_alongs: 0, diet_restriction: "", guest_name: "", guest_restrictions: ""};

        /**
         * 
         */
        fetch("/api/add", {
                method: "POST", body: JSON.stringify(args),
                headers: {"Content-Type": "application/json"} })
            .then(this.doAddResp)
            .catch(() => this.doAddError("failed to connect to server"));
    };

    doAddResp = (resp: Response): void => {
        if (resp.status === 200) {
          resp.json().then(this.doAddJson)
              .catch(() => this.doAddError("200 response is not JSON"));
        } else if (resp.status === 400) {
          resp.text().then(this.doAddError)
              .catch(() => this.doAddError("400 response is not text"));
        } else {
          this.doAddError(`bad status code from /api/add: ${resp.status}`);
        }
    };

    doAddJson = (data: unknown): void => {
        if (!isRecord(data)) {
            console.error("bad data from /api/add: not a record", data);
            return;
        }

        this.props.doBackClick();
    };
    
    doAddError = (msg: string): void => {
        this.setState({error: msg});
    };

    doBackClick = (_: MouseEvent<HTMLButtonElement>): void => {
        this.props.doBackClick();
    };


    // doStartClick = (_: MouseEvent<HTMLButtonElement>): void => {
    //   // Verify that the user entered all required information.
    //   if (this.state.name.trim().length === 0 ||
    //       this.state.description.trim().length === 0 ||
    //       this.state.seller.trim().length === 0 ||
    //       this.state.minutes.trim().length === 0 ||
    //       this.state.minBid.trim().length === 0) {
    //     this.setState({error: "a required field is missing."});
    //     return;
    //   }
  
    //   // Verify that minutes is a number.
    //   const minutes = parseFloat(this.state.minutes);
    //   if (isNaN(minutes) || minutes < 1 || Math.floor(minutes) !== minutes) {
    //     this.setState({error: "minutes is not a positive integer"});
    //     return;
    //   }
  
    //   // Ignore this request if the minutes or minBid are not numbers.
    //   const minBid = parseFloat(this.state.minBid);
    //   if (isNaN(minBid) || minBid < 1 || Math.floor(minBid) !== minBid) {
    //     this.setState({error: "min bid is not a positive integer"});
    //     return;
    //   }
  
    //   // Ask the app to start this auction (adding it to the list).
    //   this.props.onStartClick({
    //       name: this.state.name,
    //       description: this.state.description,
    //       seller: this.state.seller,
    //       minutes, minBid });
    // };
  
    // doBackClick = (_: MouseEvent<HTMLButtonElement>): void => {
    //   this.props.onBackClick();  // tell the parent this was clicked
    // };
  }
  