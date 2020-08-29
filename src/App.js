import React, { Component } from 'react'
import './App.css'
import { Modal, ModalHeader, ModalBody, Input, Label } from 'reactstrap'
import axios from 'axios'
import Loading from 'react-fullscreen-loading';

export default class App extends Component {
  state = {
    showModalA: false,
    showModalB: false,
    showModalC: false,
    searchKeyword: '',
    contacts: [],
    filteredData: [],
    onlyEven: false,
    contactDetail: '',
    isLoading: false
  }

  componentDidMount() {
    this.getAllContactsData('')
  }

  getAllContactsData = (query) => {
    this.setState({isLoading: true})
    var data = new FormData();

    var config = {
      method: 'get',
      url: `https://api.dev.pastorsline.com/api/contacts.json?companyId=171&query=${query}&page=2`,
      headers: {
        'Authorization': 'Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJzdWIiOiIxNzEiLCJleHAiOjE2MDM3ODM0Mzd9.3ievseHtX0t3roGh7nBuNsiaQeSjfiHWyyx_5GlOLXk'
      },
      data: data
    };

    axios(config)
      .then((response) => {
        console.log(response.data)
        let newArr = []
        let tempArr = Object.values(response.data.contacts)
        tempArr.forEach(element => {
          newArr.push({ fname: element.first_name, country_id: element.country_id, id: element.id, phone_number: element.phone_number })
        });
        this.setState({ contacts: newArr, isLoading: false })
      })
      .catch(function (error) {
        console.log(error);
      });
  }

  toggleModal = (modal, data) => {
    if (modal === 'A') {
      this.setState({ showModalA: !this.state.showModalA })
    } else if (modal === 'B') {
      this.setState({ showModalB: !this.state.showModalB })
    } else {
      this.setState({ showModalC: !this.state.showModalC, contactDetail: data })
    }
  }

  changeModal = (modal) => {
    if (modal === 'A') {
      this.setState({ showModalA: false, showModalB: true })
    } else {
      this.setState({ showModalB: false, showModalA: true })
    }
  }

  updateSearch = (val) => {
    this.setState({ searchKeyword: val.target.value }, () => {
      setTimeout(() => {
        this.getAllContactsData(this.state.searchKeyword)
      }, 500);
    })
  }

  onlyEvenChecked = (val) => {
    console.log(val)
    this.setState({ onlyEven: !this.state.onlyEven }, () => {
      if (val) {
        let tempArr = this.state.contacts.filter((ele, index) => {
          return ele.id % 2 === 0
        })
        this.setState({ contacts: tempArr })
      }else{
        this.getAllContactsData('')
      }
    })
  }

  render() {
    return (
      <div className="main">
        <button className="button-main btn_A" onClick={() => this.setState({ showModalA: true })}>
          <p className="btn_text">A</p>
        </button>
        <button className="button-main btn_B" onClick={() => this.setState({ showModalB: true })}>
          <p className="btn_text">B</p>
        </button>
        {this.renderModalA()}
        {this.renderModalB()}
        {this.renderModalC(this.state.contactDetail)}
        <Loading loading={this.state.isLoading} background="#46139f" loaderColor="#46139f" />
      </div>
    )
  }

  renderModalA = () => {
    return (
      <div>
        <Modal isOpen={this.state.showModalA} toggle={() => this.toggleModal('A')}>
          <ModalHeader>
            <p>Modal A</p>
            <div className="modal_body">
              {this.renderButton('All Contacts', () => { }, 'A')}
              {this.renderButton('US Contacts', () => { this.changeModal('A') }, 'B')}
              {this.renderButton('Close', () => { this.toggleModal('A') }, 'C')}
            </div>
          </ModalHeader>
          <ModalBody>
            <Input type="text" placeholder="Search Contact" value={this.state.searchKeyword} onChange={(val) => this.updateSearch(val)} />
            {this.state.contacts.map((item, index) => {
              var phoneno = /^\d{10}$/;
              let phone_number = phoneno.test(item.phone_number)
              let number = phone_number && item.phone_number
              return (
                <div className="contacts_list" onClick={() => this.toggleModal('C', item)}>
                  <p style={{ color: item.fname === null && 'red' }} className="contact_name">{item.fname === null ? 'Name not available' : item.fname}</p>
                  <p style={{ color: !number && 'red' }}>{number ? number : 'Invalid Number'}</p>
                </div>
              )
            })}
            <Label className="checkbox">
              <Input type="checkbox" value={this.state.onlyEven} onChange={() => this.onlyEvenChecked(!this.state.onlyEven)} />{''}Only even
            </Label>
          </ModalBody>
        </Modal>
      </div>
    )
  }

  renderModalB = () => {
    let USData = this.state.contacts !== [] && this.state.contacts
    let data = USData.filter((ele, index) => {
      return ele.country_id === 226
    })

    return (
      <div>
        <Modal isOpen={this.state.showModalB} toggle={() => this.toggleModal('B')}>
          <ModalHeader>
            <p>Modal B</p>
            <div className="modal_body">
              {this.renderButton('All Contacts', () => { this.changeModal('B') }, 'A')}
              {this.renderButton('US Contacts', () => { }, 'B')}
              {this.renderButton('Close', () => { this.toggleModal('B') }, 'C')}
            </div>
          </ModalHeader>
          <ModalBody>
            <Input type="text" placeholder="Search Contact" value={this.state.searchKeyword} onChange={(val) => this.updateSearch(val)} />
            {data.map((item, index) => {
              var phoneno = /^\d{10}$/;
              let phone_number = phoneno.test(item.phone_number)
              let number = phone_number && item.phone_number
              return (
                <div className="contacts_list" onClick={() => this.toggleModal('C', item)}>
                  <p style={{ color: item.fname === null && 'red' }} className="contact_name">{item.fname === null ? 'Name not available' : item.fname}</p>
                  <p style={{ color: !number && 'red' }}>{number ? number : 'Invalid Number'}</p>
                </div>
              )
            })}
            <Label className="checkbox">
              <Input type="checkbox" value={this.state.onlyEven} onChange={() => this.onlyEvenChecked(!this.state.onlyEven)} />{''}Only even
            </Label>
          </ModalBody>
        </Modal>
      </div>
    )
  }

  renderModalC = (data) => {
    return (
      <div>
        <Modal isOpen={this.state.showModalC} toggle={() => this.toggleModal('C', {})}>
          <ModalHeader>
            <p>Contact Detail</p>
          </ModalHeader>
          <ModalBody>
            <p>Name: {data.fname}</p>
            <hr />
            <p>Phone number: {data.phone_number}</p>
            <hr />
            <p>id: {data.id}</p>
          </ModalBody>
        </Modal>
      </div>
    )
  }

  renderButton = (title, action, type) => {
    return (
      <button onClick={action} className="modal_button" style={{ backgroundColor: type === 'A' ? '#46139f' : type === 'B' ? '#ff7f50' : '#ffffff', borderWidth: type === 'C' && 1 }}>
        <p style={{ color: type === 'C' && '#000000' }}>{title}</p>
      </button>
    )
  }
}
