"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateVideoDto = void 0;
const mapped_types_1 = require("@nestjs/mapped-types");
const create_video_dto_1 = require("./create-video.dto");
class UpdateVideoDto extends (0, mapped_types_1.PartialType)(create_video_dto_1.CreateVideoDto) {
}
exports.UpdateVideoDto = UpdateVideoDto;
//# sourceMappingURL=update-video.dto.js.map