package sliceutil

import "reflect"

// Contains looks for an elem in array and returns if it exists
func Contains(array, elem interface{}) bool {
	arrV := reflect.ValueOf(array)
	if arrV.Kind() == reflect.Slice {
		for i := 0; i < arrV.Len(); i++ {
			if arrV.Index(i).Interface() == elem {
				return true
			}
		}
	}
	return false
}
