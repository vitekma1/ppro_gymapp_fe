import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import React, {Component} from "react";
import {getAccountDetailUrl, getAllTrainers, removeCourseUrl, updateCourseUrl} from "../../constants";

class UpdateCoursePage extends Component {

    constructor(props) {
        super(props);
        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.state = {
            trainers: [],
            trainer:
                {
                    id: "",
                    firstName: "",
                    lastName: "",
                    login: "",
                    password: "",
                    email: "",
                    phoneNumber: "",
                    role : {id: "", name : "", accounts: []}

                },
            name: '',
            description: '',
            price: '',
            maxCapacity: '',
            beginDate: '',
            endDate: '',
            count: '',
            trainerId : ''
        }
    }

    componentDidMount() {

        //console.log(this.props.location.courseData);

        const {name, description, price, maxCapacity, beginDate, endDate, count, trainer} = this.props.location.courseData;
        this.setState({name : name, description : description, price : price, maxCapacity : maxCapacity,
            beginDate : beginDate, endDate : endDate, count : count, trainer : trainer});

        fetch(getAllTrainers, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Credentials': true,
                'Access-Control-Allow-Origin': 'http://localhost:3000'
            }
        })
            .then((response) => response.json())
            .then((jsonResponse) => {
                this.setState({trainers: jsonResponse})
                //this.setState({trainerId: jsonResponse[0].id});
                console.log("response: " + jsonResponse)
            }).catch((err) => console.error(err));
    }

    handleChange = (event) => {
        this.setState({[event.target.id]: event.target.value});
    }

    handleSubmit(event) {
        event.preventDefault();
        const data = new FormData(event.target);

        let trainer_id = data.get('trainerId');
        //console.log("id" + " " + trainer_id);

        let trainer = {
            id: "",
                firstName: "",
                lastName: "",
                login: "",
                password: "",
                email: "",
                phoneNumber: "",
                role : {id: "", name : "", accounts: []}

        };

        fetch(getAccountDetailUrl + trainer_id, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Credentials': true,
                'Access-Control-Allow-Origin': '*'
            }
        })
            .then((response) => response.json())
            .then((jsonResponse) => {
                trainer = jsonResponse;
                console.log(jsonResponse)
            }).catch((err) => console.error(err));

        console.log(trainer);

        let object = {};
        data.forEach(function (value, key) {
            object[key] = value;
        });
        // pripojit trenera k jsonovi
        object["trainer"] = trainer;
        let json = JSON.stringify(object);
        console.log(json);



        fetch(updateCourseUrl + this.props.match.params.id, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Credentials': true,
                'Access-Control-Allow-Origin': '*'
            },
            body: json
        }).then(function (response) {
            if (response.ok) {
                alert("Kurz byl upraven");
            } else {
                alert("Kurz se nepodařilo upravit");
            }
        }).then(function (text) {
        }).catch(function (error) {
            console.error(error)
        });
    }


    render() {
        return (
            <Form className="forms" onSubmit={this.handleSubmit}>
                <Form.Group controlId="formBasicEmail">
                    <Form.Label>Název</Form.Label>
                    <Form.Control defaultValue={this.state.name} name="name" type="text" placeholder="Název kurzu" required onChange={this.handleChange}/>
                </Form.Group>

                <Form.Group controlId="formBasicEmail">
                    <Form.Label>Popis</Form.Label>
                    <Form.Control defaultValue={this.state.description} name="description" type="text" placeholder="Popis kurzu" required onChange={this.handleChange}/>
                </Form.Group>

                <Form.Group controlId="formBasicEmail">
                    <Form.Label>Cena</Form.Label>
                    <Form.Control defaultValue={this.state.price} name="price" type="number" placeholder="Cena kurzu" required onChange={this.handleChange}/>
                </Form.Group>

                <Form.Group controlId="formBasicEmail">
                    <Form.Label>Kapacita</Form.Label>
                    <Form.Control defaultValue={this.state.maxCapacity} name="maxCapacity" type="number" placeholder="Kapacita kurzu" required onChange={this.handleChange}/>
                </Form.Group>

                <Form.Group controlId="formBasicEmail">
                    <Form.Label>Začátek kurzu</Form.Label>
                    <Form.Control defaultValue={this.state.beginDate} name="beginDate" type="datetime-local" placeholder="Datum a čas začátku kurzu"
                                  required onChange={this.handleChange}/>
                    <Form.Text className="text-muted">
                        Zadejte ve formátu YYYY-MM-DD
                    </Form.Text>
                </Form.Group>

                <Form.Group controlId="formBasicEmail">
                    <Form.Label>Konec kurzu</Form.Label>
                    <Form.Control defaultValue={this.state.endDate} name="endDate" type="datetime-local" placeholder="Datum konce kurzu" onChange={this.handleChange} required/>
                    <Form.Text className="text-muted">
                        Zadejte ve formátu YYYY-MM-DD
                    </Form.Text>
                </Form.Group>

                <Form.Group controlId="formBasicEmail">
                    <Form.Label>Počet konání</Form.Label>
                    <Form.Control defaultValue={this.state.count} name="count" type="number" placeholder="Počet konání" onChange={this.handleChange} required/>
                </Form.Group>

                <Form.Group>
                    <Form.Label>Výběr trenéra</Form.Label>
                    <Form.Control defaultValue={this.state.trainer.id} name="trainer" as="select" onChange={this.handleChange} required>
                        {this.state.trainers.map((trainer, index) => {
                            return (
                                <option key={index} value={trainer.id}>{trainer.firstName} {trainer.lastName}</option>
                            )
                        })}
                    </Form.Control>
                </Form.Group>

                <Button variant="primary" type="submit">
                    Upravit
                </Button>
            </Form>
        );
    }
}

export default UpdateCoursePage;
