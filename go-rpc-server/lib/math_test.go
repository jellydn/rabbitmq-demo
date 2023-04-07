// Package lib is a library that will be used by the RPC server
package lib

import "testing"

func TestSum(t *testing.T) {
	type args struct {
		a int
		b int
	}
	tests := []struct {
		name string
		args args
		want int
	}{
		{
			name: "1 + 1 = 2",
			args: args{a: 1, b: 1},
			want: 2,
		},
		{
			name: "2 + 2 = 4",
			args: args{a: 2, b: 2},
			want: 4,
		},
	}
	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			if got := Sum(tt.args.a, tt.args.b); got != tt.want {
				t.Errorf("Sum() = %v, want %v", got, tt.want)
			}
		})
	}
}
