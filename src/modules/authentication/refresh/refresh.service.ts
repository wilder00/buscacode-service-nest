import { Injectable, Logger } from '@nestjs/common'

@Injectable()
export class RefreshService {
  private readonly logger = new Logger(RefreshService.name)

  constructor() {}
}
