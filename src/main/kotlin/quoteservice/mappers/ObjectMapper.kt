package quoteservice.mappers

import com.fasterxml.jackson.databind.DeserializationFeature
import com.fasterxml.jackson.databind.ObjectMapper
import com.fasterxml.jackson.module.kotlin.jacksonObjectMapper
import org.springframework.stereotype.Component

@Component
class ObjectMapper (
    val jacksonMapper: ObjectMapper = jacksonObjectMapper().configure(DeserializationFeature.FAIL_ON_UNKNOWN_PROPERTIES, false)
){
    fun deserialize(json: String?, clazz: Class<*>): Any {
        runCatching {
            return jacksonMapper.readValue(json, clazz::class.java)
        }.getOrElse {
            throw it
        }
    }
}
