
export const TYPES = {
  IClientRepository: Symbol.for("IClientRepository"),

  IAuthService: Symbol.for("IAuthService"),
  IAuthController: Symbol.for("IAuthController"),
  IUserModel: Symbol.for("IUserModel"),
  
  ITutorService : Symbol.for("ITutorService"),
  ITutorController : Symbol.for("ITutorController"),
  ITutorRepository: Symbol.for("ITutorRepository"),
  ITutorModel : Symbol.for("ITutorModel"),

  IAdminController : Symbol.for("IAdminController"),
  IAdminRepository : Symbol.for("IAdminRepository"),
  IAdminService: Symbol.for("IAdminService"),

  ISlotController : Symbol.for("ISlotController"),
  ISlotService : Symbol.for("ISlotService"),
  ISlotRepository : Symbol.for("ISlotRepository"),

  ISessionController : Symbol.for("ISessionController"),
  ISessionService : Symbol.for("ISessionService"),
  ISessionRepository : Symbol.for("ISessionRepository"),

};
