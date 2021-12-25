package dao

import (
	"database/sql"
	"encoding/json"
)

// NullFloat64 sql.NullFloat64 alias to be used at model entities fields where JSON marshal/unmarshal is required
type NullFloat64 struct {
	sql.NullFloat64
}

// MarshalJSON Custom marshal for sql.NullFloat64 datatype. Used at json.Marshal functions
func (v NullFloat64) MarshalJSON() ([]byte, error) {
	if v.Valid {
		return json.Marshal(v.Float64)
	} else {
		return json.Marshal(nil)
	}
}

// UnmarshalJSON Custom unmarshal for sql.NullFloat64 datatype. Used at json.Unmarshal functions
func (v *NullFloat64) UnmarshalJSON(data []byte) error {
	var value *float64
	if err := json.Unmarshal(data, &value); err != nil {
		return err
	}
	if value != nil {
		v.Valid = true
		v.Float64 = *value
	} else {
		v.Valid = false
	}
	return nil
}
