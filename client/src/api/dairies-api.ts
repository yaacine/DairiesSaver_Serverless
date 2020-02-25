import { apiEndpoint } from '../config'
import { Dairy } from '../types/Dairy';
import { CreateDairyRequest } from '../types/CreateDairyRequest';
import Axios from 'axios'
import { UpdateDairyRequest } from '../types/UpdateDairyRequest';

export async function getDairys(idToken: string): Promise<Dairy[]> {
  console.log('Fetching todos')

  const response = await Axios.get(`${apiEndpoint}/todos`, {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${idToken}`
    },
  })
  console.log('Todos:', response.data)
  return response.data.items
}

export async function createDairy(
  idToken: string,
  newDairy: CreateDairyRequest
): Promise<Dairy> {
  const response = await Axios.post(`${apiEndpoint}/todos`,  JSON.stringify(newDairy), {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${idToken}`
    }
  })
  return response.data.item
}

export async function patchDairy(
  idToken: string,
  dairyId: string,
  updatedDairy: UpdateDairyRequest
): Promise<void> {
  await Axios.patch(`${apiEndpoint}/todos/${dairyId}`, JSON.stringify(updatedDairy), {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${idToken}`
    }
  })
}

export async function deleteDairy(
  idToken: string,
  dairyId: string
): Promise<void> {
  await Axios.delete(`${apiEndpoint}/todos/${dairyId}`, {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${idToken}`
    }
  })
}

export async function getUploadUrl(
  idToken: string,
  todoId: string
): Promise<string> {
  const response = await Axios.post(`${apiEndpoint}/todos/${todoId}/attachment`, '', {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${idToken}`
    }
  })
  return response.data.uploadUrl
}

export async function uploadFile(uploadUrl: string, file: Buffer): Promise<void> {
  await Axios.put(uploadUrl, file)
}
