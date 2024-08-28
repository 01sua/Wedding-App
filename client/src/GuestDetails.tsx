import React, { ChangeEvent, Component, MouseEvent } from 'react';
import { Guest, parseGuest } from './Guest';
import { isRecord } from './record';


type GuestDetailsProps = {
    // info: Array<Guest>,
    // index: number,
    onBackClick: () => void,
    name: string
    // onSaveClick: (index: number, diet_restriction: string, additional_guests: number, plus_one: boolean) => void
}

type GuestDetailsState = {
    guest: Guest | undefined,
    dietary_restrictions: string,
    additional_guests: number,
    add_guest_name: string,
    add_guest_diet: string,
    first_time: boolean,
    error: string
}

// Shows a guest, and details about that particular guest that can be updated
export class GuestDetails extends Component<GuestDetailsProps, GuestDetailsState> {

    constructor(props: GuestDetailsProps) {
        super(props);
        this.state = {guest: undefined, dietary_restrictions: "", additional_guests: 0, add_guest_name: "", add_guest_diet: "", first_time: true, error: ""};
    }

    componentDidMount = (): void => {
        this.doRefreshClick();
    }

    render = (): JSX.Element => {
        if (this.state.guest === undefined) {
            // return <p>Loading guest "{this.props.name}"...</p>
            this.doRefreshClick();
            return <div></div>;
        } else if (this.state.first_time) {
            this.doUpdateClick();
            this.setState({first_time: false});
            return <div></div>;  
        }
        return (
            <div>
                <h1>Guest Details</h1>
                <p>{this.state.guest.name}, guest of {this.state.guest.guest_of}, {this.state.guest.family ? "family" : ""}</p>
                <br></br>
                <div>
                    <label htmlFor="Dietary Restrictions">Dietary Restrictions: (Specify "none" if none)</label>
                    <br></br>
                    <input type="text" id='?' value={this.state.dietary_restrictions} onChange={this.doDietaryRestrictionChange}></input>
                </div>
                <div>
                    <label htmlFor='Additional Guest'>Additional Guests</label>
                    <select id="Additional Guest" value={this.state.additional_guests} onChange={this.doAdditionalGuestChange}>
                        <option value="0">0</option>
                        <option value="1">1</option>
                    </select>
                </div>
                <div>{this.renderAdditionalGuest()}</div>
                <br></br>
                <button type="button" onClick={this.doSaveClick}>Save</button>
                <button type="button" onClick={this.doBackClick}>Back</button>
                {this.renderError()}
            </div>
        )
    };

    renderAdditionalGuest = (): JSX.Element => {
        if (this.state.additional_guests === 1) {
            return (
                <div>
                    <div>
                        <label htmlFor="Guest Name">Guest Name: </label>
                        <input type="text" value={this.state.add_guest_name} onChange={this.doGuestNameChange}></input>
                    </div>
                    <div>
                        <label htmlFor="Guest Diet">Guest Dietary Restrictions: (Specify "none" if none)</label>
                        <br></br>
                        <input type="text" value={this.state.add_guest_diet} onChange={this.doGuestDietRestrictChange}></input>   
                    </div>
                </div>
            );
        } else {
            return (<div></div>);
        }
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

    doDietaryRestrictionChange = (evt: ChangeEvent<HTMLInputElement>): void => {
        this.setState({dietary_restrictions: evt.target.value});
    };

    doAdditionalGuestChange = (evt: ChangeEvent<HTMLSelectElement>): void => {
        this.setState({additional_guests: parseInt(evt.target.value)});
    };

    
    doBackClick = (_: MouseEvent<HTMLButtonElement>): void => {
        this.props.onBackClick();
    };

    doGuestNameChange = (evt: ChangeEvent<HTMLInputElement>): void => {
        this.setState({add_guest_name: evt.target.value});
    };

    doGuestDietRestrictChange = (evt: ChangeEvent<HTMLInputElement>): void => {
        this.setState({add_guest_diet: evt.target.value});
    };

    doRefreshClick = (): void => {
        fetch("/api/get?name=" + encodeURIComponent(this.props.name))
          .then(this.doGetResp)
          .catch(() => this.doGetError("failed to connect to server"));
    };

    doGetResp = (res: Response): void => {
        if (res.status === 200) {
            res.json().then(this.doGetJson)
                .catch(() => this.doGetError("200 res is not JSON"));
        } else if (res.status === 400) {
            res.text().then(this.doGetError)
                .catch(() => this.doGetError("400 response is not text"));
        } else {
            this.doGetError(`bad status code from /api/get: ${res.status}`);
        }
    };

    doGetJson = (data: unknown): void => {
        if (!isRecord(data)) {
          console.error("bad data from /api/get: not a record", data);
          return;
        }
    
        this.doGuestChange(data);
      };


    // Shared helper to update the state with the new auction.
    doGuestChange = (data: {guest?: unknown}): void => {
        const guest = parseGuest(data.guest);
        console.log(guest);
        if (guest !== undefined) {
        // If the current bid is too small, let's also fix that.
            this.setState({guest: guest});
        } else {
            console.error("auction from /api/get did not parse", data.guest);
        }
    };


      doGetError = (msg: string): void => {
        console.error(`Error fetching /api/get: ${msg}`);
      };
    
    doSaveClick = (_: MouseEvent<HTMLButtonElement>): void => {
        if (this.state.guest === undefined)
            throw new Error("impossible");

        if (this.state.dietary_restrictions.trim().length === 0) {
            this.setState({error: "a required field is missing."});
            return;
        }

        if (this.state.additional_guests === 1) {
            if (this.state.add_guest_name === "" || this.state.add_guest_diet === "") {
                this.setState({error: "missing information about additional guest"});
                return;
            }
        }

        const args: Guest = {name: this.state.guest.name, guest_of: this.state.guest.guest_of, family: this.state.guest.family, 
                plus_one: true, tag_alongs: this.state.additional_guests , diet_restriction: this.state.dietary_restrictions, 
                guest_name: this.state.add_guest_name, guest_restrictions: this.state.add_guest_diet};
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

        this.props.onBackClick();
    };
    
    doAddError = (msg: string): void => {
        this.setState({error: msg});
    };
  
    doUpdateClick = (): void => {
        if (this.state.guest !== undefined) {
        this.setState({dietary_restrictions: this.state.guest.diet_restriction, additional_guests: this.state.guest.tag_alongs, add_guest_name: this.state.guest.guest_name, add_guest_diet: this.state.guest.guest_restrictions});
        }
    }

}