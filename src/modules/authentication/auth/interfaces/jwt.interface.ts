export interface JwtPayload {
  /**User uuid */
  sub: string
  /**User email */
  email: string
  /**Type of token */
  type: 'access' | 'refresh'
}
