import axios from 'axios'
import { apiConstants } from '../constants'

export interface AuthUser {
  id: number
  name: string
  categoryGroup: string
  username: string
}

export interface AuthResponse {
  token: string
  user: AuthUser
}

export async function login(username: string, password: string): Promise<AuthResponse> {
  const res = await axios.post<AuthResponse>(apiConstants.login, { username, password })
  return res.data
}

export async function register(
  name: string,
  categoryGroup: string,
  username: string,
  password: string
): Promise<AuthResponse> {
  const res = await axios.post<AuthResponse>(apiConstants.register, {
    name,
    categoryGroup,
    username,
    password,
  })
  return res.data
}