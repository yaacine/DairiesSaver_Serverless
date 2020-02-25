import dateFormat from 'dateformat'
import { History } from 'history'
import update from 'immutability-helper'
import * as React from 'react'
import {
  Button,
  Checkbox,
  Divider,
  Grid,
  Header,
  Icon,
  Input,
  Image,
  Loader
} from 'semantic-ui-react'

import { createDairy, deleteDairy, getDairys, patchDairy } from '../api/dairies-api'
import Auth from '../auth/Auth'
import { Dairy } from '../types/Dairy'

interface DairysProps {
  auth: Auth
  history: History
}

interface DairysState {
  dairies: Dairy[]
  newDairyName: string
  loadingDairys: boolean
}

export class Dairys extends React.PureComponent<DairysProps, DairysState> {
  state: DairysState = {
    dairies: [],
    newDairyName: '',
    loadingDairys: true
  }

  handleNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    this.setState({ newDairyName: event.target.value })
  }

  onEditButtonClick = (dairyId: string) => {
    this.props.history.push(`/todos/${dairyId}/edit`)
  }

  onTodoCreate = async (event: React.ChangeEvent<HTMLButtonElement>) => {
    try {
      const dueDate = this.calculateDueDate()
      const newDairy = await createDairy(this.props.auth.getIdToken(), {
        name: this.state.newDairyName,
        dueDate
      })
      this.setState({
        dairies: [...this.state.dairies, newDairy],
        newDairyName: ''
      })
    } catch {
      alert('Todo creation failed')
    }
  }

  onTodoDelete = async (dairyId: string) => {
    try {
      await deleteDairy(this.props.auth.getIdToken(), dairyId)
      this.setState({
        dairies: this.state.dairies.filter(todo => todo.dairyId != dairyId)
      })
    } catch {
      alert('Todo deletion failed')
    }
  }

  onTodoCheck = async (pos: number) => {
    try {
      const dairy = this.state.dairies[pos]
      await patchDairy(this.props.auth.getIdToken(), dairy.dairyId, {
        name: dairy.name,
        dueDate: dairy.dueDate,
        done: !dairy.done
      })
      this.setState({
        dairies: update(this.state.dairies, {
          [pos]: { done: { $set: !dairy.done } }
        })
      })
    } catch {
      alert('Todo deletion failed')
    }
  }

  async componentDidMount() {
    try {
      const dairies = await getDairys(this.props.auth.getIdToken())
      this.setState({
        dairies,
        loadingDairys: false
      })
    } catch (e) {
      alert(`Failed to fetch todos: ${e.message}`)
    }
  }

  render() {
    return (
      <div>
        <Header as="h1">TODOs</Header>

        {this.renderCreateTodoInput()}

        {this.renderTodos()}
      </div>
    )
  }

  renderCreateTodoInput() {
    return (
      <Grid.Row>
        <Grid.Column width={16}>
          <Input
            action={{
              color: 'teal',
              labelPosition: 'left',
              icon: 'add',
              content: 'New task',
              onClick: this.onTodoCreate
            }}
            fluid
            actionPosition="left"
            placeholder="To change the world..."
            onChange={this.handleNameChange}
          />
        </Grid.Column>
        <Grid.Column width={16}>
          <Divider />
        </Grid.Column>
      </Grid.Row>
    )
  }

  renderTodos() {
    if (this.state.loadingDairys) {
      return this.renderLoading()
    }

    return this.renderTodosList()
  }

  renderLoading() {
    return (
      <Grid.Row>
        <Loader indeterminate active inline="centered">
          Loading TODOs
        </Loader>
      </Grid.Row>
    )
  }

  renderTodosList() {
    return (
      <Grid padded>
        {this.state.dairies.map((todo, pos) => {
          return (
            <Grid.Row key={todo.dairyId}>
              <Grid.Column width={1} verticalAlign="middle">
                <Checkbox
                  onChange={() => this.onTodoCheck(pos)}
                  checked={todo.done}
                />
              </Grid.Column>
              <Grid.Column width={10} verticalAlign="middle">
                {todo.name}
              </Grid.Column>
              <Grid.Column width={3} floated="right">
                {todo.dueDate}
              </Grid.Column>
              <Grid.Column width={1} floated="right">
                <Button
                  icon
                  color="blue"
                  onClick={() => this.onEditButtonClick(todo.dairyId)}
                >
                  <Icon name="pencil" />
                </Button>
              </Grid.Column>
              <Grid.Column width={1} floated="right">
                <Button
                  icon
                  color="red"
                  onClick={() => this.onTodoDelete(todo.dairyId)}
                >
                  <Icon name="delete" />
                </Button>
              </Grid.Column>
              {todo.attachmentUrl && (
                <Image src={todo.attachmentUrl} size="small" wrapped />
              )}
              <Grid.Column width={16}>
                <Divider />
              </Grid.Column>
            </Grid.Row>
          )
        })}
      </Grid>
    )
  }

  calculateDueDate(): string {
    const date = new Date()
    date.setDate(date.getDate() + 7)

    return dateFormat(date, 'yyyy-mm-dd') as string
  }
}
